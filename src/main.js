const {
  utility,
  backEnd: {
    management: { authentication },
    persistence: { UnitOfWork, databases },
  },
} = require("@ciro-maciel/utility");

const { TABLE_NAME } = process.env;

const uow = new UnitOfWork(new databases.Dynamo(), TABLE_NAME);

exports.handler = async (event, context) => {
  try {
    switch (event.httpMethod) {
      case "POST": {
        return context.succeed(
          utility.http.response(`ciro-maciel - mOnitor - services`)
        );
      }
      case "GET": {
        const { url = "http://ciro-maciel.me/" } = event.queryStringParameters;

        return context.succeed(utility.http.response(`service performed`));
      }
      default:
        return context.succeed(utility.http.response(event.httpMethod));
    }
  } catch (error) {
    return context.succeed(utility.http.response(error.message));
  }
};

exports.health = async (event, context) => {
  try {
    return context.succeed(utility.http.response(`👌 - Okay running`));
  } catch (error) {
    return context.succeed(utility.http.response(error.message));
  }
};
