import amqp from "amqplib";

const RABBITMQ_URL = "amqp://admin:admin@rabbitmq:5672";
const EXCHANGE_NAME = "payments_exchange";
const EXCHANGE_TYPE = "fanout";
const QUEUE_NAME = "notifications_queue";

async function startConsumer() {
  try {
    console.log("aqui0");
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log("aqui1");
    const channel = await connection.createChannel();
    console.log("aqui2");

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: false,
    });

    // Cria uma fila anônima e exclusiva para este consumidor
    const q = await channel.assertQueue(QUEUE_NAME, { exclusive: true });
    console.log(
      `[*] Serviço de Notificações esperando por eventos na fila: ${q.queue}`
    );

    // Liga a fila à exchange para receber as mensagens
    channel.bindQueue(q.queue, EXCHANGE_NAME, "");

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          const payment = JSON.parse(msg.content.toString());
          console.log(`[!] Recebido evento 'Pagamento criado' [${payment}].`);
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Erro no consumidor de Notificações:", error);
    setTimeout(startConsumer, 10000);
  }
}

startConsumer();
