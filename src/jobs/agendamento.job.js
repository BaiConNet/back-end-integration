const cron = require('node-cron');
const Agendamento = require('../models/agendamento.model');
const Schedule = require('../models/schedule.model');

cron.schedule('*/5 * * * *', async () => {
  try {
    const agora = new Date();

    const agendamentos = await Agendamento.find({
      status: 'AGENDADO'
    }).populate('horario');

    for (const agendamento of agendamentos) {
      const horaFimObj = new Date(`${agendamento.horario.data}T${agendamento.horario.horaFim}:00`);
      if (horaFimObj <= agora) {
        agendamento.status = 'CONCLUIDO';
        await agendamento.save();
        console.log(`✅ Agendamento ${agendamento._id} concluído automaticamente`);
      }
    }
  } catch (err) {
    console.error('Erro no job de atualização automática:', err);
  }
});
