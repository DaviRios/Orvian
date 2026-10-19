import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '@orvian/contracts';
import { login } from '../../services/auth.service';
import { zodResolver } from '../../lib/zod-resolver';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { OrvianLogo } from '../../components/brand/OrvianLogo';
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
    <main className="min-h-dvh bg-orvian-charcoal sm:p-4 lg:p-[clamp(1rem,2vw,2.5rem)]">
      <div className="mx-auto grid min-h-dvh w-full overflow-hidden bg-orvian-shadow sm:min-h-[calc(100dvh-2rem)] sm:rounded-[clamp(1.25rem,1.8vw,2rem)] sm:border sm:border-orvian-secondary/40 sm:shadow-[0_24px_70px_rgba(0,0,0,0.28)] lg:min-h-[calc(100dvh-clamp(2rem,4vw,5rem))] lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <section className="relative flex min-h-[400px] overflow-hidden border-b border-orvian-secondary/40 bg-gradient-to-br from-orvian-charcoal via-orvian-shadow to-orvian-secondary px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(1.25rem,4vh,4rem)] sm:min-h-[440px] lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="pointer-events-none absolute -left-24 -top-28 size-[26rem] rounded-full bg-orvian-secondary/20 blur-2xl" />
          <div className="pointer-events-none absolute -right-20 top-[8%] size-[24rem] rotate-12 rounded-[5rem] bg-orvian-lavender/15" />
          <div className="pointer-events-none absolute bottom-[7%] left-[12%] h-32 w-72 -rotate-12 rounded-[3rem] bg-orvian-gold/10" />

          <div className="relative z-10 flex w-full flex-col">
            <div className="flex items-center gap-3">
              <OrvianLogo
                variant="mark"
                decorative
                className="size-[clamp(2.5rem,3vw,4.25rem)] shrink-0 overflow-hidden rounded-[clamp(0.75rem,0.8vw,1.25rem)] shadow-[0_10px_24px_rgba(239,89,40,0.28)]"
              />
              <span>
                <strong className="block text-[clamp(1rem,1.25vw,1.75rem)] font-bold tracking-[0.08em] text-white">
                  Orvian
                </strong>
                <span className="block text-[clamp(0.55rem,0.5vw,0.8rem)] font-semibold uppercase tracking-[0.16em] text-orvian-lavender">
                  Gestão de conteúdo
                </span>
              </span>
            </div>

            <div className="mt-[clamp(2rem,8vh,7rem)] max-w-[42rem]">
              <p className="mb-2 text-[clamp(0.62rem,0.58vw,0.9rem)] font-bold uppercase tracking-[0.18em] text-orvian-primary">
                Painel editorial
              </p>
              <h2 className="m-0 max-w-[14ch] text-[clamp(1.75rem,3vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-white">
                Bem-vindo ao Orvian
              </h2>
              <p className="mb-0 mt-[clamp(0.75rem,1.5vh,1.5rem)] max-w-[38rem] text-[clamp(0.75rem,0.8vw,1.25rem)] font-medium leading-relaxed text-orvian-gold">
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

        <section className="flex items-center justify-center bg-orvian-shadow px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(2rem,7vh,6rem)]">
          <form
            className="flex w-full max-w-[30rem] flex-col gap-[clamp(1rem,2vh,1.5rem)]"
            onSubmit={submit}
          >
            <div>
              <p className="mb-2 text-[clamp(0.62rem,0.58vw,0.85rem)] font-bold uppercase tracking-[0.18em] text-orvian-primary">
                Área administrativa
              </p>
              <h1 className="m-0 text-[clamp(1.75rem,2.2vw,3rem)] font-bold tracking-[-0.03em] text-white">
                Acesso ao Orvian
              </h1>
              <p className="mb-0 mt-2 text-[clamp(0.75rem,0.7vw,1.05rem)] font-normal leading-relaxed text-orvian-lavender">
                Entre com suas credenciais para continuar.
              </p>
            </div>

            <label className="flex flex-col gap-2 text-[clamp(0.75rem,0.68vw,1rem)] font-semibold text-white">
              E-mail
              <input
                className="h-[clamp(3rem,3.3vw,4rem)] rounded-[clamp(0.75rem,0.75vw,1rem)] border border-orvian-secondary bg-orvian-charcoal px-[clamp(1rem,1vw,1.25rem)] text-[clamp(0.8rem,0.7vw,1rem)] font-normal text-white outline-none transition placeholder:text-orvian-gray hover:border-orvian-lavender focus:border-orvian-primary focus:ring-4 focus:ring-orvian-primary/15"
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

            <label className="flex flex-col gap-2 text-[clamp(0.75rem,0.68vw,1rem)] font-semibold text-white">
              Senha
              <input
                className="h-[clamp(3rem,3.3vw,4rem)] rounded-[clamp(0.75rem,0.75vw,1rem)] border border-orvian-secondary bg-orvian-charcoal px-[clamp(1rem,1vw,1.25rem)] text-[clamp(0.8rem,0.7vw,1rem)] font-normal text-white outline-none transition placeholder:text-orvian-gray hover:border-orvian-lavender focus:border-orvian-primary focus:ring-4 focus:ring-orvian-primary/15"
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
              className="h-[clamp(3rem,3.3vw,4rem)] rounded-[clamp(0.75rem,0.75vw,1rem)] bg-orvian-primary text-[clamp(0.8rem,0.72vw,1.05rem)] shadow-[0_8px_20px_rgba(239,89,40,0.24)] hover:bg-orvian-orange"
            >
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </Button>

            <p className="mb-0 text-center text-[clamp(0.6rem,0.55vw,0.85rem)] font-normal text-orvian-gold">
              Acesso seguro ao painel de gestão Orvian
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;
