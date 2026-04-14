import { Router } from 'express';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eduvibe_secret_key_2026';

// Middleware to verify admin token
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Não autorizado.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Sessão expirada.' });
  }
};

router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, recentEnrollments] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, avatar: true, email: true } },
          course: { select: { title: true } },
        },
      }),
    ]);

    // Mock revenue for now as we don't have a payments table yet
    const monthlyRevenue = totalEnrollments * 497; // Assuming average price

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      monthlyRevenue,
      recentEnrollments: recentEnrollments.map(e => ({
        id: e.id,
        name: e.user.name,
        email: e.user.email,
        course: e.course.title,
        date: e.createdAt,
        status: 'Pago', // Mock status
        amount: 'R$ 497,00',
        avatar: e.user.avatar,
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
  }
});

router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

export default router;
