import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        // name: true, // Add name if you add it to User model
                    }
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ ok: false, message: 'Failed to fetch posts' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

    const { title, content, prompt, tags } = req.body;

    if (!title || !content) {
        return res.status(400).json({ ok: false, message: 'Title and content are required' });
    }

    try {
        const post = await prisma.post.create({
            data: {
                userId,
                title,
                content,
                prompt: prompt || '',
                tags: tags || []
            }
        });
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ ok: false, message: 'Failed to create post' });
    }
};

export const likePost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

    try {
        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId: id
                    }
                }
            });
            return res.status(200).json({ ok: true, message: 'Unliked' });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId,
                    postId: id
                }
            });
            return res.status(200).json({ ok: true, message: 'Liked' });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ ok: false, message: 'Failed to toggle like' });
    }
};

export const addComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ ok: false, message: 'Content is required' });

    try {
        const comment = await prisma.comment.create({
            data: {
                userId,
                postId: id,
                content
            }
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ ok: false, message: 'Failed to add comment' });
    }
};
