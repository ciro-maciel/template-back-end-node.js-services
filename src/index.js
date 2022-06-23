const {
  persistence: { UnitOfWork, databases },
} = require("@rili-saas/utility/clients/backend");

const { TABLE_NAME } = process.env;

const uow = new UnitOfWork(new databases.Dynamo(), TABLE_NAME);

exports.index = async (event, context) => {
  try {
    return context.succeed(utility.http.response(`👌 - Okay running`));
  } catch (error) {
    return context.succeed(utility.http.response(error.message));
  }
};
