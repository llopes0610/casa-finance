import type { Request, Response } from "express";

import { supabase } from "../lib/supabase";
import { mapBillFromDatabase } from "../mappers/finance-mappers";

type BillStatus = "pending" | "paid";

type BillBody = {
  description?: string;
  amount?: number;
  category?: string;
  dueDate?: string;
  status?: BillStatus;
};

function validateBillBody(body: BillBody) {
  if (!body.description || body.description.trim().length < 3) {
    return "Informe uma descrição válida.";
  }

  if (!body.amount || Number(body.amount) <= 0) {
    return "Informe um valor maior que zero.";
  }

  if (!body.category) {
    return "Informe uma categoria.";
  }

  if (!body.dueDate) {
    return "Informe a data de vencimento.";
  }

  if (!body.status || !["pending", "paid"].includes(body.status)) {
    return "Informe um status válido.";
  }

  return null;
}

export async function listBills(request: Request, response: Response) {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return response.status(500).json({
      message: "Erro ao listar contas.",
      error: error.message,
    });
  }

  return response.json((data ?? []).map(mapBillFromDatabase));
}

export async function createBill(request: Request, response: Response) {
  const body = request.body as BillBody;

  const validationError = validateBillBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("bills")
    .insert({
      description: body.description,
      amount: body.amount,
      category: body.category,
      due_date: body.dueDate,
      status: body.status,
    })
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao criar conta.",
      error: error.message,
    });
  }

  return response.status(201).json(mapBillFromDatabase(data));
}

export async function updateBill(request: Request, response: Response) {
  const { id } = request.params;
  const body = request.body as BillBody;

  const validationError = validateBillBody(body);

  if (validationError) {
    return response.status(400).json({
      message: validationError,
    });
  }

  const { data, error } = await supabase
    .from("bills")
    .update({
      description: body.description,
      amount: body.amount,
      category: body.category,
      due_date: body.dueDate,
      status: body.status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao atualizar conta.",
      error: error.message,
    });
  }

  return response.json(mapBillFromDatabase(data));
}

export async function toggleBillStatus(request: Request, response: Response) {
  const { id } = request.params;

  const { data: bill, error: findError } = await supabase
    .from("bills")
    .select("status")
    .eq("id", id)
    .single();

  if (findError) {
    return response.status(500).json({
      message: "Erro ao buscar conta.",
      error: findError.message,
    });
  }

  const newStatus = bill.status === "pending" ? "paid" : "pending";

  const { data, error } = await supabase
    .from("bills")
    .update({
      status: newStatus,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao alterar status da conta.",
      error: error.message,
    });
  }

  return response.json(mapBillFromDatabase(data));
}

export async function deleteBill(request: Request, response: Response) {
  const { id } = request.params;

  const { error } = await supabase.from("bills").delete().eq("id", id);

  if (error) {
    return response.status(500).json({
      message: "Erro ao deletar conta.",
      error: error.message,
    });
  }

  return response.status(204).send();
}