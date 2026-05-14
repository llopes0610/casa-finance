import type { Request, Response } from "express";

import { supabase } from "../lib/supabase";
import { mapRevenueFromDatabase } from "../mappers/finance-mappers";

type RevenueBody = {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
};

function validateRevenueBody(body: RevenueBody) {
  if (!body.description || body.description.trim().length < 3) {
    return "Informe uma descrição válida.";
  }

  if (!body.amount || Number(body.amount) <= 0) {
    return "Informe um valor maior que zero.";
  }

  if (!body.category) {
    return "Informe uma categoria.";
  }

  if (!body.date) {
    return "Informe a data.";
  }

  return null;
}

export async function listRevenues(request: Request, response: Response) {
  const { data, error } = await supabase
    .from("revenues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return response.status(500).json({
      message: "Erro ao listar receitas.",
      error: error.message,
    });
  }

  return response.json((data ?? []).map(mapRevenueFromDatabase));
}

export async function createRevenue(request: Request, response: Response) {
  const body = request.body as RevenueBody;

  const validationError = validateRevenueBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("revenues")
    .insert({
      description: body.description,
      amount: body.amount,
      category: body.category,
      date: body.date,
    })
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao criar receita.",
      error: error.message,
    });
  }

  return response.status(201).json(mapRevenueFromDatabase(data));
}

export async function updateRevenue(request: Request, response: Response) {
  const { id } = request.params;
  const body = request.body as RevenueBody;

  const validationError = validateRevenueBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("revenues")
    .update({
      description: body.description,
      amount: body.amount,
      category: body.category,
      date: body.date,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao atualizar receita.",
      error: error.message,
    });
  }

  return response.json(mapRevenueFromDatabase(data));
}

export async function deleteRevenue(request: Request, response: Response) {
  const { id } = request.params;

  const { error } = await supabase.from("revenues").delete().eq("id", id);

  if (error) {
    return response.status(500).json({
      message: "Erro ao deletar receita.",
      error: error.message,
    });
  }

  return response.status(204).send();
}