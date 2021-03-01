const {
  utility,
  backEnd: {
    persistence: { UnitOfWork, databases },
  },
} = require("@ciro-maciel/utility");

const { TABLE_NAME } = process.env;

const uow = new UnitOfWork(new databases.Dynamo(), TABLE_NAME);

exports.index = async (event, context) => {
  try {
    return context.succeed(utility.http.response(`👌 - Okay running`));
  } catch (error) {
    return context.succeed(utility.http.response(error.message));
  }
};

exports.notification = async (event, context) => {
  try {
    return context.succeed(utility.http.response(`👌 - Okay running`));
  } catch (error) {
    return context.succeed(utility.http.response(error.message));
  }
};
