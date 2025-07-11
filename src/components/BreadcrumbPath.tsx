// components/Breadcrumb.js
'use client'; // Se estiver usando app router

import { useRouter } from 'next/router';

const BreadcrumbPath = () => {
  const router = useRouter();

  // Exemplo: "/lancamentos/produto"
  const path = router.pathname;

  // Divide a rota em partes e remove strings vazias
  const pathParts = path.split('/').filter(Boolean);

  // Cria a string do BreadcrumbPath
  const breadcrumb = ['/', ...pathParts].join(' > ');

  return <div>{breadcrumb}</div>;
};

export default BreadcrumbPath;
