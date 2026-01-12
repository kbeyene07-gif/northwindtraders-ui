export const ApiEndpoints = {
  customers: {
    root: '/customers',
    byId: (id: number) => `/customers/${id}`
  }
};
