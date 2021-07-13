// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');

const MESSAGE_TOPIC_ARN = process.env.MESSAGE_TOPIC
const sns = new AWS.SNS();

/* publishes a message to your topic defined in the serverless.yml
 *
 * invoke with the serverless cli.  Ex.
 *   sls invoke -f publisher --data '{ "name": "Bob", "ourExampleField": "value1" }'
 *
 */

exports.publish = async (event) => {
  console.log(event)
  const params = {
    // SNS expects message to be a string
    Message: JSON.stringify(event),
    TopicArn: MESSAGE_TOPIC_ARN,
    // MessageAttributes allow for the consumer of the Message Topic to apply a filtering policy.
    // This allows the consumer to not have to programmatically sort through all events,
    //   instead only react to the events that they care about
    MessageAttributes: {
      customer_interests: {
        DataType: 'String.Array',
        // stringified array
        StringValue: '["soccer", "rugby", "hockey"]',
      },
      store: {
        DataType: 'String',
        StringValue: 'example_corp',
      },
      event: {
        DataType: 'String',
        StringValue: 'order_placed',
      },
      price_usd: {
        DataType: 'Number',
        StringValue: '210.75',
      },
    },
  }

  if (typeof event.ourExampleField === 'string') {
    params.MessageAttributes.ourExampleAttribute = {
      DataType: 'String',
      StringValue: event.ourExampleField,
    }
  }

  try {
    const response = await sns.publish(params).promise()
    return { statusCode: 200, body: JSON.stringify(response) }
  } catch (e) {
    console.log(e)
    return { statusCode: 500, body: JSON.stringify(e) }
  }
}
