interface ToastOptions {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const toast = (options: ToastOptions) => {
  // Simple alert-based toast for now
  const message = options.title ? `${options.title}: ${options.description}` : options.description;
  alert(message);
}; 