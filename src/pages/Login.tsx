import { useState } from "react";
import { LockKeyhole, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";

import { useAuth } from "../contexts/AuthContext";

type LoginFormData = {
  email: string;
  password: string;
};

export function Login() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    try {
      setErrorMessage("");

      await login(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao tentar fazer login.",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
            <Wallet size={36} />
          </div>

          <h1 className="text-2xl font-bold text-white">Casa Finance</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Entre para gerenciar suas receitas, contas, metas e emergências.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seuemail@email.com"
              {...register("email")}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Senha
            </label>
            <input
              type="password"
              placeholder="Sua senha"
              {...register("password")}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockKeyhole size={18} />
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}