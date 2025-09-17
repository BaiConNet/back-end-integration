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

      const [horaInicio, minutoInicio] = agendamento.horario.horaInicio.split(':');
      const horaInicioObj = new Date(agendamento.horario.data);
      horaInicioObj.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0, 0);

      // Criar Date do horário final corretamente
      const [horaFim, minutoFim] = agendamento.horario.horaFim.split(':');
      const horaFimObj = new Date(agendamento.horario.data);
      horaFimObj.setHours(parseInt(horaFim), parseInt(minutoFim), 0, 0);

      // Comparar com horário atual
      if (agora >= horaFimObj && agora >= horaInicioObj) {
        agendamento.status = 'CONCLUIDO';
        await agendamento.save();
        console.log(`✅ Agendamento ${agendamento._id} concluído automaticamente`);
      }
    }

    const hoje = new Date();
    hoje.setUTCHours(0, 0, 0, 0);
    await Schedule.deleteMany({ data: { $lt: hoje } });
    console.log('Horários antigos excluídos');
  } catch (err) {
    console.error('Erro no job de atualização automática:', err);
  }
});
