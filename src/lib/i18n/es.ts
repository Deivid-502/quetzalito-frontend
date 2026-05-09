/**
 * Diccionario de traducciones en español (idioma por defecto).
 * Estructura plana con keys puntuadas para fácil lookup.
 */
export const es = {
  // Navegación
  'nav.home': 'Inicio',
  'nav.history': 'Historial',
  'nav.envelopes': 'Sobres',
  'nav.budgets': 'Presupuestos',
  'nav.add': 'Agregar',
  'nav.account': 'Cuenta',
  'nav.settings': 'Ajustes',
  'nav.logout': 'Salir',
  'nav.premium': 'Hazte Premium',

  // Common
  'common.cancel': 'Cancelar',
  'common.save': 'Guardar',
  'common.saveChanges': 'Guardar cambios',
  'common.delete': 'Eliminar',
  'common.edit': 'Editar',
  'common.confirm': 'Confirmar',
  'common.loading': 'Cargando…',
  'common.required': 'Obligatorio',
  'common.optional': 'Opcional',
  'common.back': 'Volver',

  // Auth
  'auth.greeting': 'Hola, {name}',
  'auth.loggedOut': 'Sesión cerrada.',

  // Idiomas (se traducen al idioma activo)
  'languages.es': 'Español',
  'languages.en': 'Inglés',

  // Validación nativa del browser (sobreescribe los mensajes del SO)
  'validation.valueMissing': 'Completá este campo.',
  'validation.typeMismatch.email': 'Ingresá un correo válido.',
  'validation.typeMismatch.url': 'Ingresá una URL válida.',
  'validation.tooShort': 'Mínimo {n} caracteres.',
  'validation.tooLong': 'Máximo {n} caracteres.',
  'validation.rangeUnderflow': 'El valor mínimo es {n}.',
  'validation.rangeOverflow': 'El valor máximo es {n}.',
  'validation.stepMismatch': 'Ingresá un valor válido.',
  'validation.patternMismatch': 'Formato inválido.',
  'validation.badInput': 'Valor inválido.',

  // Dashboard
  'dashboard.todayHint': 'Esto es lo que pasa con tu dinero hoy, {date}.',
  'dashboard.addExpense': 'Agregar gasto',
  'dashboard.totalBalance': 'Saldo total disponible',
  'dashboard.monthIncome': 'Ingresos del mes',
  'dashboard.monthExpense': 'Gastos del mes',
  'dashboard.dailyLimit': 'Podés gastar hoy',
  'dashboard.expensesByCategory': 'Gastos por categoría',
  'dashboard.recentActivity': 'Actividad reciente',
  'dashboard.yourEnvelopes': 'Tus sobres',
  'dashboard.viewAll': 'Ver todos',
  'dashboard.viewHistory': 'Ver historial',
  'dashboard.budgetAlerts': 'Presupuestos en alerta',
  'dashboard.tip': 'Tip',

  // Profile
  'profile.title': 'Mi cuenta',
  'profile.subtitle': 'Administrá tu información personal.',
  'profile.changePhoto': 'Cambiar foto',
  'profile.personalInfo': 'Información personal',
  'profile.firstName': 'Nombre',
  'profile.lastName': 'Apellido',
  'profile.nickname': 'Apodo',
  'profile.phone': 'Teléfono',
  'profile.phoneOptional': '(opcional)',
  'profile.email': 'Correo',
  'profile.emailNote': 'Para cambiarlo, ve a Ajustes › Seguridad',
  'profile.saved': 'Perfil actualizado.',
  'profile.avatarPicker': 'Elegí tu avatar',
  'profile.avatarInitials': 'Usar iniciales',
  'profile.avatarRemove': 'Quitar foto y usar iniciales',
  'profile.avatarPending': 'Vista previa — guardá los cambios para aplicarlo.',
  'profile.useUrl': 'Usar URL personalizada',

  // Settings
  'settings.title': 'Ajustes',
  'settings.subtitle': 'Personalizá tu experiencia.',
  'settings.management': 'Gestión',
  'settings.preferences': 'Preferencias',
  'settings.security': 'Seguridad',
  'settings.plan': 'Plan',
  'settings.language': 'Idioma',
  'settings.currency': 'Moneda',
  'settings.theme': 'Tema',
  'settings.theme.light': 'Claro',
  'settings.theme.dark': 'Oscuro',
  'settings.theme.system': 'Automático',
  'settings.changePassword': 'Cambiar contraseña',
  'settings.changeEmail': 'Cambiar correo',
  'settings.categories': 'Categorías',
  'settings.categoriesDesc': 'Personalizá las categorías para tus movimientos',
  'settings.budgetsDesc': 'Definí cuánto querés gastar al mes',
  'settings.preferencesSaved': 'Preferencias actualizadas.',
  'settings.logout': 'Cerrar sesión',
  'settings.upgrade': 'Hazte Premium',
  'settings.cancelSubscription': 'Cancelar suscripción',
  'settings.cancelSubscriptionDesc': 'Volvé al plan Free cuando quieras.',
  'settings.managePlan': 'Administrar plan',

  // Security
  'security.changePassword.title': 'Cambiar contraseña',
  'security.changePassword.desc': 'Por seguridad, vamos a cerrar tus sesiones en otros dispositivos.',
  'security.currentPassword': 'Contraseña actual',
  'security.newPassword': 'Nueva contraseña',
  'security.confirmPassword': 'Confirmar nueva contraseña',
  'security.passwordHint': 'Mínimo 8 caracteres con mayúscula, minúscula y número',
  'security.passwordMismatch': 'Las contraseñas no coinciden.',
  'security.passwordChanged': 'Contraseña actualizada. Vas a tener que iniciar sesión de nuevo.',
  'security.changeEmailSoon': 'El cambio de correo estará disponible próximamente.',

  // Legal & Footer
  'legal.privacy': 'Política de privacidad',
  'legal.terms': 'Términos y condiciones',
  'legal.cookies': 'Política de cookies',
  'legal.contact': 'Contacto',
  'legal.refund': 'Política de reembolso',
  'legal.copyright': '© {year} Quetzalito · Hecho con 💚 en Guatemala',
  'legal.academicNotice': 'Este es un proyecto académico sin fines comerciales. La información mostrada en los apartados legales es referencial y no constituye un acuerdo vinculante entre las partes.',
} as const;

export type TranslationKey = keyof typeof es;
