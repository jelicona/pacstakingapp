const getPacviewerData = (params: any) => {
  const querys: any = {
    getBalance: `/v1/accounts/${params.wallet}/balance`,

  };

  return querys[params.endpoint]

};


export { getPacviewerData }
