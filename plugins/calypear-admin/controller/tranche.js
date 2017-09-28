const Accepts = require('accepts');
const Boom = require('boom');


module.exports = {
  searchTranches: function(request,reply) {
    const Tranche = request.server.collections(true).tranche;

    Tranche.find().then((result) => {
      reply.view('tranche/list.hbs',{'tranches': result});
    }).catch((err) => {
      reply(err);
    });
  },
  getTranche: function(request, reply) {
    const Tranche = request.server.collections(true).tranche;

    Trance.find({id: request.params.id}).then((result) => {
      reply.view('tranche/show.hbs',{tranche: result});
    }).catch((err) => {
      reply(err);
    });
  },
  createTranche: function(request, reply) {
    const Tranche = request.server.collections(true).tranche;

    if (request.payload.name) {
      Tranche.create({
        name: request.payload.name
      }).then((result) => {
        reply.redirect('admin/tranche/'+result.id);
      }).catch((err)=>{
        reply(err);
      })
    } else {
      //TODO: Put the proper boom here (no internets atm)
      reply('Invalid data');
    }
  },
  updateTranche: function(request, reply) {
    const Tranche = request.server.collections(true).tranche;

    Tranche.update({
      id: request.params.id
    },{
      name: request.payload.name
    }).then((result)=>{
      reply.redirect('/admin/tranche/'+result.id)
    }).catch((err) => {
      reply(err);
    })
  },
  deleteTranche: function(request, reply) {
    //const Tranche = request.server.collections(true).tranche;

    //TODO: Put the proper boom here (no internets atm)
    reply('Not implemented yet');
  }
}
