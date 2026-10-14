import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '@soir/contracts';
import { login } from '../../services/auth.service';
import { zodResolver } from '../../lib/zod-resolver';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { DashboardIllustration } from '../dashboard/DashboardIllustration';

export function Login() {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setServerError('');
    try {
      await login({ email: values.email ?? '', password: values.password });
      window.location.reload();
    } catch (reason) {
      setServerError(
        reason instanceof Error ? reason.message : 'Não foi possível entrar.',
      );
    }
  });

  return (
    <main className="min-h-dvh bg-[#F8FAFD] sm:p-4 lg:p-[clamp(1rem,2vw,2.5rem)]">
      <div className="mx-auto grid min-h-dvh w-full overflow-hidden bg-white sm:min-h-[calc(100dvh-2rem)] sm:rounded-[clamp(1.25rem,1.8vw,2rem)] sm:border sm:border-slate-200 sm:shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:min-h-[calc(100dvh-clamp(2rem,4vw,5rem))] lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <section className="relative flex min-h-[400px] overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-50 via-[#EEF6FF] to-[#DCEEFF] px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1.25rem,4vh,4rem)] sm:min-h-[440px] lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="pointer-events-none absolute -left-24 -top-28 size-[26rem] rounded-full bg-white/45 blur-2xl" />
          <div className="pointer-events-none absolute -right-20 top-[8%] size-[24rem] rotate-12 rounded-[5rem] bg-blue-300/20" />
          <div className="pointer-events-none absolute bottom-[7%] left-[12%] h-32 w-72 -rotate-12 rounded-[3rem] bg-white/35" />

          <div className="relative z-10 flex w-full flex-col">
            <div className="flex items-center gap-3">
              <span className="grid size-[clamp(2.5rem,3vw,4.25rem)] place-items-center rounded-[clamp(0.75rem,0.8vw,1.25rem)] bg-blue-500 text-[clamp(1rem,1.2vw,1.75rem)] font-bold text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)]">
                S
              </span>
              <span>
                <strong className="block text-[clamp(1rem,1.25vw,1.75rem)] font-bold tracking-[0.08em] text-slate-900">
                  Soir
                </strong>
                <span className="block text-[clamp(0.55rem,0.5vw,0.8rem)] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Gestão de conteúdo
                </span>
              </span>
            </div>

            <div className="mt-[clamp(2rem,8vh,7rem)] max-w-[42rem]">
              <p className="mb-2 text-[clamp(0.62rem,0.58vw,0.9rem)] font-bold uppercase tracking-[0.18em] text-blue-500">
                Painel editorial
              </p>
              <h2 className="m-0 max-w-[14ch] text-[clamp(1.75rem,3vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-slate-900">
                Bem-vindo ao Soir
              </h2>
              <p className="mb-0 mt-[clamp(0.75rem,1.5vh,1.5rem)] max-w-[38rem] text-[clamp(0.75rem,0.8vw,1.25rem)] font-normal leading-relaxed text-slate-500">
                Gerencie todo o conteúdo do seu site de forma simples, rápida e
                organizada.
              </p>
            </div>

            <div className="pointer-events-none absolute bottom-[-4.5rem] right-[-3rem] hidden lg:block 2xl:bottom-[-2rem] 2xl:right-[2%]">
              <DashboardIllustration className="h-[clamp(230px,22vw,520px)] w-[clamp(487px,46.6vw,1100px)]" />
            </div>
            <div className="pointer-events-none -mb-14 -mr-16 mt-auto flex justify-end self-end sm:-mb-20 sm:-mr-4 lg:hidden">
              <DashboardIllustration className="h-[180px] w-[381px] sm:h-[220px] sm:w-[466px]" />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(2rem,7vh,6rem)]">
          <form
            className="flex w-full max-w-[30rem] flex-col gap-[clamp(1rem,2vh,1.5rem)]"
            onSubmit={submit}
          >
            <div>
              <p className="mb-2 text-[clamp(0.62rem,0.58vw,0.85rem)] font-bold uppercase tracking-[0.18em] text-blue-500">
                Área administrativa
              </p>
              <h1 className="m-0 text-[clamp(1.75rem,2.2vw,3rem)] font-bold tracking-[-0.03em] text-slate-900">
                Acesso ao CMS
              </h1>
              <p className="mb-0 mt-2 text-[clamp(0.75rem,0.7vw,1.05rem)] font-normal leading-relaxed text-slate-500">
                Entre com suas credenciais para continuar.
              </p>
            </div>

            <label className="flex flex-col gap-2 text-[clamp(0.75rem,0.68vw,1rem)] font-semibold text-slate-700">
              E-mail
              <input
                className="h-[clamp(3rem,3.3vw,4rem)] rounded-[clamp(0.75rem,0.75vw,1rem)] border border-slate-200 bg-slate-50 px-[clamp(1rem,1vw,1.25rem)] text-[clamp(0.8rem,0.7vw,1rem)] font-normal text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                type="email"
                autoComplete="username"
                placeholder="seu@email.com"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-xs font-medium text-red-600">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2 text-[clamp(0.75rem,0.68vw,1rem)] font-semibold text-slate-700">
              Senha
              <input
                className="h-[clamp(3rem,3.3vw,4rem)] rounded-[clamp(0.75rem,0.75vw,1rem)] border border-slate-200 bg-slate-50 px-[clamp(1rem,1vw,1.25rem)] text-[clamp(0.8rem,0.7vw,1rem)] font-normal text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                {...register('password')}
              />
              {errors.password && (
                <span className="text-xs font-medium text-red-600">
                  {errors.password.message}
                </span>
              )}
            </label>

            {serverError && <Alert>{serverError}</Alert>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-[clamp(3rem,3.3vw,4rem)] rounded-[clamp(0.75rem,0.75vw,1rem)] bg-blue-500 text-[clamp(0.8rem,0.72vw,1.05rem)] shadow-[0_8px_20px_rgba(59,130,246,0.2)] hover:bg-blue-600"
            >
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </Button>

            <p className="mb-0 text-center text-[clamp(0.6rem,0.55vw,0.85rem)] font-normal text-slate-400">
              Acesso seguro ao painel de gestão Soir
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;
