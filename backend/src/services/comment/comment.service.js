import { prisma } from "../../utils/prisma.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../errors/errorHandler.js";
import { Comment } from "../../classes/comment/comment.js";

export const createComment = async (curationId, data) => {
  const id = BigInt(curationId);

  // 큐레이션 존재 여부 확인
  const curation = await prisma.curation.findUnique({
    where: { id },
  });

  if (!curation) {
    throw new NotFoundError("큐레이션이 존재하지 않습니다");
  }

  const style = await prisma.style.findUnique({
    where: { id: curation.style_id },
  });

  if (!style) {
    throw new NotFoundError("스타일이 존재하지 않습니다");
  }

  if (style.password !== data.password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다");
  }

  // 이미 답글이 존재하는지 확인 (1:1 관계)
  const existingReply = await prisma.reply.findUnique({
    where: { curation_id: id },
  });

  if (existingReply) {
    throw new BadRequestError("이미 답글이 존재합니다");
  }

  // 답글 생성
  const reply = await prisma.reply.create({
    data: {
      curation_id: id,
      author: style.author,
      content: data.content,
      password: data.password,
    },
  });

  return new Comment(reply);
};

export const updateComment = async (commentId, data) => {
  const id = BigInt(commentId);

  // 존재 여부 및 비밀번호 확인
  const reply = await prisma.reply.findUnique({
    where: { id },
  });

  if (!reply) {
    throw new NotFoundError("답글이 존재하지 않습니다");
  }

  if (reply.password !== data.password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다");
  }

  // 업데이트
  const updatedReply = await prisma.reply.update({
    where: { id },
    data: {
      content: data.content,
    },
  });

  return new Comment(updatedReply);
};

export const deleteComment = async (commentId, password) => {
  const id = BigInt(commentId);

  const reply = await prisma.reply.findUnique({
    where: { id },
  });

  if (!reply) {
    throw new NotFoundError("답글이 존재하지 않습니다");
  }

  if (reply.password !== password) {
    throw new ForbiddenError("비밀번호가 틀렸습니다");
  }

  await prisma.reply.delete({
    where: { id },
  });

  return { message: "답글 삭제 성공" };
};
