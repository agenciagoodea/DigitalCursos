import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from './middleware/auth';

const router = Router();

// Public: List published courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        instructor: { select: { name: true, avatar: true } },
        _count: { select: { enrollments: true } },
      },
    });

    const formattedCourses = courses.map(c => ({
      ...c,
      studentsCount: c._count.enrollments,
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ message: 'Erro ao buscar cursos.' });
  }
});

// Admin/Instructor: List all courses (including drafts)
router.get('/admin/all', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req: AuthRequest, res) => {
  try {
    const where = req.user?.role === 'ADMIN' ? {} : { instructorId: req.user?.userId };
    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { name: true, avatar: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cursos do painel.' });
  }
});

// Public/Student: Get course details
router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: { select: { name: true, avatar: true, bio: true } },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    res.json({
      ...course,
      studentsCount: course._count.enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar curso.' });
  }
});

// Admin/Instructor: Create course
router.post('/', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req: AuthRequest, res) => {
  try {
    const { title, description, price, category, level, thumbnail } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        category,
        level,
        thumbnail,
        instructorId: req.user!.userId,
      }
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar curso.' });
  }
});

// Admin/Instructor: Update course
router.put('/:id', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req: AuthRequest, res) => {
  try {
    const { title, description, price, category, level, thumbnail, status } = req.body;
    
    // Check ownership if not admin
    if (req.user?.role !== 'ADMIN') {
      const existing = await prisma.course.findUnique({ where: { id: req.params.id } });
      if (existing?.instructorId !== req.user?.userId) {
        return res.status(403).json({ message: 'Não autorizado.' });
      }
    }

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        category,
        level,
        thumbnail,
        status,
      }
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar curso.' });
  }
});

// Admin/Instructor: Delete course
router.delete('/:id', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req: AuthRequest, res) => {
  try {
    // Check ownership if not admin
    if (req.user?.role !== 'ADMIN') {
      const existing = await prisma.course.findUnique({ where: { id: req.params.id } });
      if (existing?.instructorId !== req.user?.userId) {
        return res.status(403).json({ message: 'Não autorizado.' });
      }
    }

    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: 'Curso excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir curso.' });
  }
});

// --- Module Management ---

router.post('/:courseId/modules', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req, res) => {
  try {
    const { title, order } = req.body;
    const module = await prisma.module.create({
      data: {
        title,
        order: parseInt(order) || 0,
        courseId: req.params.courseId
      }
    });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar módulo.' });
  }
});

router.put('/modules/:id', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req, res) => {
  try {
    const { title, order } = req.body;
    const module = await prisma.module.update({
      where: { id: req.params.id },
      data: { title, order: order !== undefined ? parseInt(order) : undefined }
    });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar módulo.' });
  }
});

router.delete('/modules/:id', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req, res) => {
  try {
    await prisma.module.delete({ where: { id: req.params.id } });
    res.json({ message: 'Módulo excluído.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir módulo.' });
  }
});

// --- Lesson Management ---

router.post('/modules/:moduleId/lessons', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req, res) => {
  try {
    const { title, content, videoUrl, duration, order, type } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        duration: parseInt(duration) || 0,
        order: parseInt(order) || 0,
        type: type || 'VIDEO',
        moduleId: req.params.moduleId
      }
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar lição.' });
  }
});

router.put('/lessons/:id', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req, res) => {
  try {
    const { title, content, videoUrl, duration, order, type } = req.body;
    const lesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        videoUrl,
        duration: duration !== undefined ? parseInt(duration) : undefined,
        order: order !== undefined ? parseInt(order) : undefined,
        type
      }
    });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar lição.' });
  }
});

router.delete('/lessons/:id', authenticate, authorize(['ADMIN', 'INSTRUCTOR']), async (req, res) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lição excluída.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir lição.' });
  }
});

export default router;
