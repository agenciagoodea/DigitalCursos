import { Router } from 'express';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eduvibe_secret_key_2026';

// Middleware to verify token
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Não autorizado.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Sessão expirada.' });
  }
};

router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: { select: { name: true } },
                modules: { include: { lessons: true } },
              },
            },
          },
        },
        progress: true,
        notifications: { orderBy: { createdAt: 'desc' }, take: 10 },
        quizAttempts: true,
        certificates: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
  }
});

router.post('/enroll/:courseId', authenticate, async (req: any, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: 'Erro ao realizar inscrição.' });
  }
});

router.post('/progress/:lessonId', authenticate, async (req: any, res) => {
  try {
    const { lessonId } = req.params;
    const { completed } = req.body;
    const userId = req.user.userId;

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: { completed },
      create: { userId, lessonId, completed },
    });

    res.json(progress);
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ message: 'Erro ao salvar progresso.' });
  }
});

export default router;
