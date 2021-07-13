// find by going to localhost:4040 and hitting inspect
// assuming you have your local ngrok running it will allow us to forward requests to
// whatever server you have running, or at least see the requests as they come in
// checkout https://ngrok.com/ for more info on ngrok
const POST_IP = `${process.env.NGROK_HOST}/SNS-POST-PLAYGROUND`

const axios = require('axios')

exports.a = async (event) => {
  console.log(`messageId: ${event.Records[0].Sns.MessageId}`)
  const res = await axios.post(POST_IP, {
    event,
    actor: 'function a',
  })
  console.log(`statusCode: ${res.statusCode}`)
  console.log(res)

  // throw new Error(`Test error: ${event.Records[0].Sns.MessageId}`)
}

// B has a filtering policy attached, will only be invoked when the fields
//  of the messageAttribute match the filtering policy defined in the yml
exports.b = async (event) => {
  console.log(`messageId: ${event.Records[0].Sns.MessageId}`)
  axios.post(POST_IP, {
    event,
    actor: 'function b',
  })
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
      return res
    })
    .catch((error) => {
      console.error(error)
    })
}
