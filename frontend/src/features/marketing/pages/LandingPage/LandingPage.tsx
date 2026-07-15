import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { Scale, Calculator, ShieldCheck, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <Scale className={styles.brandIcon} size={28} />
          <span><strong>VadeMath</strong></span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features">Recursos</a>
          <a href="#pricing">Planos</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className={styles.navActions}>
          <Link to="/login" className={styles.loginLink}>Entrar</Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Comece Grátis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>O SaaS Jurídico Definitivo</div>
          <h1 className={styles.title}>
            Cálculos Jurídicos Precisos em <span className={styles.highlight}>Segundos</span>.
          </h1>
          <p className={styles.subtitle}>
            Automatize liquidações trabalhistas e cíveis. Pare de perder honorários por erros de cálculo e concentre-se na estratégia do seu escritório.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<ChevronRight size={20} />}>
                Testar Gratuitamente por 7 dias
              </Button>
            </Link>
            <Button variant="outline" size="lg">Ver Demonstração</Button>
          </div>
          <p className={styles.trustHint}>Não exige cartão de crédito. Cancele quando quiser.</p>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Tecnologia de ponta a favor da justiça</h2>
          <p>Tudo que seu escritório precisa para escalar, em uma única plataforma.</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}><Calculator size={24} /></div>
            <h3>Motor de Regras Nativo</h3>
            <p>Trabalhista, Cível ou Previdenciário. Nosso motor calcula automaticamente juros compostos, correção monetária e multas vigentes.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}><ShieldCheck size={24} /></div>
            <h3>Auditabilidade e Segurança</h3>
            <p>Tenants isolados e criptografia ponta-a-ponta. Suas memórias de cálculo são geradas em PDF inalterável e assinado digitalmente.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}><Zap size={24} /></div>
            <h3>Velocidade Extrema</h3>
            <p>Faça em 3 minutos o que demorava 4 horas no Excel. Evite litígios por divergência de valores e agilize a execução.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionHeader}>
          <h2>Planos Simples e Transparentes</h2>
          <p>Escolha o tamanho ideal para o seu escritório.</p>
        </div>
        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <h3>Básico</h3>
            <div className={styles.price}><span>R$</span> 99 <span>/mês</span></div>
            <ul className={styles.featuresList}>
              <li><CheckCircle2 size={16} /> Até 50 cálculos/mês</li>
              <li><CheckCircle2 size={16} /> Suporte por email</li>
              <li><CheckCircle2 size={16} /> 1 Usuário (Advogado)</li>
            </ul>
            <Button variant="outline" className={styles.priceBtn}>Assinar Básico</Button>
          </div>
          
          <div className={`${styles.priceCard} ${styles.priceCardPro}`}>
            <div className={styles.popularBadge}>Mais Escolhido</div>
            <h3>Escritório Pro</h3>
            <div className={styles.price}><span>R$</span> 249 <span>/mês</span></div>
            <ul className={styles.featuresList}>
              <li><CheckCircle2 size={16} /> Cálculos Ilimitados</li>
              <li><CheckCircle2 size={16} /> Suporte Prioritário 24/7</li>
              <li><CheckCircle2 size={16} /> Até 10 Usuários</li>
              <li><CheckCircle2 size={16} /> Relatórios Avançados e PDF</li>
            </ul>
            <Button variant="primary" className={styles.priceBtn}>Começar Teste Grátis</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <Scale size={24} className={styles.brandIcon} />
            <span><strong>VadeMath</strong></span>
          </div>
          <p>© 2026 VadeMath. Todos os direitos reservados.</p>
          <div className={styles.legalLinks}>
            <a href="#">Termos de Uso</a>
            <a href="#">Política de Privacidade (LGPD)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
