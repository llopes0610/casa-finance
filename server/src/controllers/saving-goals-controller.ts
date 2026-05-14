import type { Request, Response } from "express";

import { supabase } from "../lib/supabase";
import { mapSavingGoalFromDatabase } from "../mappers/finance-mappers";

type SavingGoalBody = {
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  category?: string;
  deadline?: string;
};

function validateSavingGoalBody(body: SavingGoalBody) {
  if (!body.title || body.title.trim().length < 3) {
    return "Informe um nome válido para a meta.";
  }

  if (!body.targetAmount || Number(body.targetAmount) <= 0) {
    return "Informe um valor alvo maior que zero.";
  }

  if (body.currentAmount === undefined || Number(body.currentAmount) < 0) {
    return "O valor atual não pode ser negativo.";
  }

  if (!body.category) {
    return "Informe uma categoria.";
  }

  if (!body.deadline) {
    return "Informe o prazo da meta.";
  }

  return null;
}

export async function listSavingGoals(request: Request, response: Response) {
  const { data, error } = await supabase
    .from("saving_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return response.status(500).json({
      message: "Erro ao listar metas de poupança.",
      error: error.message,
    });
  }

  return response.json((data ?? []).map(mapSavingGoalFromDatabase));
}

export async function createSavingGoal(request: Request, response: Response) {
  const body = request.body as SavingGoalBody;

  const validationError = validateSavingGoalBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("saving_goals")
    .insert({
      title: body.title,
      target_amount: body.targetAmount,
      current_amount: body.currentAmount,
      category: body.category,
      deadline: body.deadline,
    })
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao criar meta de poupança.",
      error: error.message,
    });
  }

  return response.status(201).json(mapSavingGoalFromDatabase(data));
}

export async function updateSavingGoal(request: Request, response: Response) {
  const { id } = request.params;
  const body = request.body as SavingGoalBody;

  const validationError = validateSavingGoalBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("saving_goals")
    .update({
      title: body.title,
      target_amount: body.targetAmount,
      current_amount: body.currentAmount,
      category: body.category,
      deadline: body.deadline,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao atualizar meta de poupança.",
      error: error.message,
    });
  }

  return response.json(mapSavingGoalFromDatabase(data));
}

export async function addMoneyToSavingGoal(
  request: Request,
  response: Response,
) {
  const { id } = request.params;
  const { amount } = request.body as { amount?: number };

  if (!amount || Number(amount) <= 0) {
    return response.status(400).json({
      message: "Informe um valor maior que zero para adicionar.",
    });
  }

  const { data: goal, error: findError } = await supabase
    .from("saving_goals")
    .select("current_amount")
    .eq("id", id)
    .single();

  if (findError) {
    return response.status(500).json({
      message: "Erro ao buscar meta de poupança.",
      error: findError.message,
    });
  }

  const currentAmount = Number(goal.current_amount);
  const newAmount = currentAmount + Number(amount);

  const { data, error } = await supabase
    .from("saving_goals")
    .update({
      current_amount: newAmount,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao adicionar dinheiro na meta.",
      error: error.message,
    });
  }

  return response.json(mapSavingGoalFromDatabase(data));
}

export async function deleteSavingGoal(request: Request, response: Response) {
  const { id } = request.params;

  const { error } = await supabase
    .from("saving_goals")
    .delete()
    .eq("id", id);

  if (error) {
    return response.status(500).json({
      message: "Erro ao deletar meta de poupança.",
      error: error.message,
    });
  }

  return response.status(204).send();
}