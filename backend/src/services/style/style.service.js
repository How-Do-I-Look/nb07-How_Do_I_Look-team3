
import {
  UnregisteredStyle,
  Style,
  StyleCategory,
  StyleItem,
  StyleImage,
} from "./style.js";
import { prisma } from "../../utils/prisma.js";
import { NotFoundError } from "../../errors/errorHandler.js";

export async function getStyles(req, res, next) {
  try {
    const styles = await prisma.style.findMany({
      orderBy: { created_at: "desc" }, 
      include: {
        tags: true,
        items: true,
        images: true,
        curations: true,
      },
    });

    const data = styles.map((entity) => Style.fromEntity(entity));
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createStyle(req, res, next) {
  try {
    const {
      title,
      description,
      password,
      tags = [],
      items = [],
      images = [],
    } = req.body;

    const unregistered = UnregisteredStyle.fromInfo({
      title,
      description,
      password,
      tags,
      items,
      images,
    });

    const created = await prisma.style.create({
      data: {
        title: unregistered.title,
        description: unregistered.description,
        password: unregistered.password,
        
      },
      include: {
        tags: true,
        items: true,
        images: true,
        curations: true,
      },
    });

    const style = Style.fromEntity(created);
    return res.status(201).json(style);
  } catch (error) {
    next(error);
  }
}

export async function updateStyle(req, res, next) {
  try {
    const styleId = Number(req.params.styleId);

    const {
      title,
      description,
      password,
      tags = [],
      items = [],
      images = [],
    } = req.body;

    const existing = await prisma.style.findUnique({
      where: { id: styleId },
      include: {
        tags: true,
        items: true,
        images: true,
        curations: true,
      },
    });

    if (!existing) {
      throw new NotFoundError("스타일을 찾을 수 없습니다.");
    }

    if (password && existing.password && existing.password !== password) {
      const err = new Error("비밀번호가 일치하지 않습니다.");
      err.statusCode = 403;
      throw err;
    }

    const unregistered = UnregisteredStyle.fromInfo({
      title: title ?? existing.title,
      description: description ?? existing.description,
      password: existing.password, 
      tags,
      items,
      images,
    });

    const updated = await prisma.style.update({
      where: { id: styleId },
      data: {
        title: unregistered.title,
        description: unregistered.description,
      },
      include: {
        tags: true,
        items: true,
        images: true,
        curations: true,
      },
    });

    const style = Style.fromEntity(updated);
    return res.status(200).json(style);
  } catch (error) {
    next(error);
  }
}

export async function deleteStyle(req, res, next) {
  try {
    const styleId = Number(req.params.styleId);
    const { password } = req.body; 

    const existing = await prisma.style.findUnique({
      where: { id: styleId },
    });

    if (!existing) {
      throw new NotFoundError("스타일을 찾을 수 없습니다.");
    }

    if (password && existing.password && existing.password !== password) {
      const err = new Error("비밀번호가 일치하지 않습니다.");
      err.statusCode = 403;
      throw err;
    }

    

    await prisma.style.delete({
      where: { id: styleId },
    });

    return res.status(200).json({ message: "스타일이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
}
