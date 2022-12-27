export const handleError = (
  err: any,
  stack = 'not defined',
  enqueueSnackbar?: Function | null
) => {
  err && console.log(err);

  err.status && console.log('status: ', err.status);

  const mainError = err.data?.message;
  mainError && console.log(mainError);
  enqueueSnackbar &&
    mainError &&
    enqueueSnackbar(mainError, { variant: 'error' });

  const causes = err.data?.data;
  causes && console.table(causes);
  causes &&
    Object.entries(causes).forEach(([key, value]: any) => {
      enqueueSnackbar &&
        enqueueSnackbar(`${key} ${value?.message}`, { variant: 'info' });
    });

  console.log('on: ', stack);

  // if status === unauthorized => logout();

  // TODO: translation + better error messages(more user friendly)
};
