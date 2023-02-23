const sortOnCategories = (data, focus) => {
  console.log(data);
  const newData = {
    org: {
      name: data.org.name,
      total: data.org.total,
      categories: {},
    },
  };

  for (const [entityKey, entity] of Object.entries(data.org.entities)) {
    for (const [accountKey, account] of Object.entries(entity.accounts)) {
      for (const [category, amount] of Object.entries(account.categories)) {
        if (!newData.org.categories[category]) {
          newData.org.categories[category] = {
            total: 0,
            accounts: [],
          };
        }
        newData.org.categories[category].accounts.push({
          entity: entityKey,
          account: accountKey,
          total: amount,
        });
        newData.org.categories[category].total += amount;
      }
    }
  }

  return newData;
};

export { sortOnCategories };
