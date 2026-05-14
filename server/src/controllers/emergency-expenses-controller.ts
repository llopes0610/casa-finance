import type { Request, Response } from "express";

import { supabase } from "../lib/supabase";
import { mapEmergencyExpenseFromDatabase } from "../mappers/finance-mappers";

type EmergencyPriority = "low" | "medium" | "high";

type EmergencyExpenseBody = {
  description?: string;
  amount?: number;
  category?: string;
  priority?: EmergencyPriority;
  date?: string;
};

function validateEmergencyExpenseBody(body: EmergencyExpenseBody) {
  if (!body.description || body.description.trim().length < 3) {
    return "Informe uma descrição válida.";
  }

  if (!body.amount || Number(body.amount) <= 0) {
    return "Informe um valor maior que zero.";
  }

  if (!body.category) {
    return "Informe uma categoria.";
  }

  if (!body.priority || !["low", "medium", "high"].includes(body.priority)) {
    return "Informe uma prioridade válida.";
  }

  if (!body.date) {
    return "Informe a data.";
  }

  return null;
}

export async function listEmergencyExpenses(
  request: Request,
  response: Response,
) {
  const { data, error } = await supabase
    .from("emergency_expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return response.status(500).json({
      message: "Erro ao listar gastos emergenciais.",
      error: error.message,
    });
  }

  return response.json((data ?? []).map(mapEmergencyExpenseFromDatabase));
}

export async function createEmergencyExpense(
  request: Request,
  response: Response,
) {
  const body = request.body as EmergencyExpenseBody;

  const validationError = validateEmergencyExpenseBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("emergency_expenses")
    .insert({
      description: body.description,
      amount: body.amount,
      category: body.category,
      priority: body.priority,
      date: body.date,
    })
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao criar gasto emergencial.",
      error: error.message,
    });
  }

  return response.status(201).json(mapEmergencyExpenseFromDatabase(data));
}

export async function updateEmergencyExpense(
  request: Request,
  response: Response,
) {
  const { id } = request.params;
  const body = request.body as EmergencyExpenseBody;

  const validationError = validateEmergencyExpenseBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("emergency_expenses")
    .update({
      description: body.description,
      amount: body.amount,
      category: body.category,
      priority: body.priority,
      date: body.date,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao atualizar gasto emergencial.",
      error: error.message,
    });
  }

  return response.json(mapEmergencyExpenseFromDatabase(data));
}

export async function deleteEmergencyExpense(
  request: Request,
  response: Response,
) {
  const { id } = request.params;

  const { error } = await supabase
    .from("emergency_expenses")
    .delete()
    .eq("id", id);

  if (error) {
    return response.status(500).json({
      message: "Erro ao deletar gasto emergencial.",
      error: error.message,
    });
  }

  return response.status(204).send();
}