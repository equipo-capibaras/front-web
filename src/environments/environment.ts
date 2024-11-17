export const environment = {
  production: false,
  apiUrl: '/api/v1',

  dashboardUrl: {
    'es-CO':
      'https://lookerstudio.google.com/embed/reporting/6fe75816-9231-4f5b-afb8-4b032eb2433f/page/LsLRE?hl=es',
    'es-AR':
      'https://lookerstudio.google.com/embed/reporting/6fe75816-9231-4f5b-afb8-4b032eb2433f/page/LsLRE?hl=es',
    'pt-BR':
      'https://lookerstudio.google.com/embed/reporting/0eed73ee-f38a-49cb-9fd0-263aa55f9705/page/LsLRE?hl=pt',
  } as Record<string, string>,
};
