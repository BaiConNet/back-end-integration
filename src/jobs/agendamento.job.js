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
      if (!agendamento.horario) continue; // pular se horário não existir

      // Criar Date do horário final corretamente
      const [hora, minuto] = agendamento.horario.horaFim.split(':');
      const horaFimObj = new Date(agendamento.horario.data);
      horaFimObj.setHours(parseInt(hora), parseInt(minuto), 0, 0);

      // Comparar com horário atual
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
