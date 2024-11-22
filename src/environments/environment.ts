export const environment = {
  production: false,
  apiUrl: '/api/v1',

  dashboardIncidentsUrl: {
    'es-CO':
      'https://lookerstudio.google.com/embed/reporting/6fe75816-9231-4f5b-afb8-4b032eb2433f/page/LsLRE?hl=es',
    'es-AR':
      'https://lookerstudio.google.com/embed/reporting/6fe75816-9231-4f5b-afb8-4b032eb2433f/page/LsLRE?hl=es',
    'pt-BR':
      'https://lookerstudio.google.com/embed/reporting/0eed73ee-f38a-49cb-9fd0-263aa55f9705/page/LsLRE?hl=pt',
  } as Record<string, string>,

  dashboardUsersUrl: {
    'es-CO':
      'https://lookerstudio.google.com/embed/reporting/ac664d4d-72e2-4e80-96da-80f912c3aa4d/page/IdEUE?hl=es',
    'es-AR':
      'https://lookerstudio.google.com/embed/reporting/ac664d4d-72e2-4e80-96da-80f912c3aa4d/page/IdEUE?hl=es',
    'pt-BR':
      'https://lookerstudio.google.com/embed/reporting/7be82ee7-b1d2-447e-82e5-13cf644579d2/page/IdEUE?hl=pt',
  } as Record<string, string>,
};
