export const handleError = (
  err: any,
  stack = 'not defined',
  enqueueSnackbar: Function
) => {
  console.log('status: ', err.status);

  const mainError = err.data.message;
  console.log(mainError);
  enqueueSnackbar(mainError, { variant: 'error' });

  const causes = err.data.data;
  console.table(causes);
  Object.entries(causes).forEach(([key, value]: any) => {
    enqueueSnackbar(`${key} ${value?.message}`, { variant: 'info' });
  });

  console.log('on: ', stack);

  // if status === unauthorized => logout();

  // TODO: translation + better error messages(more user friendly)
};
