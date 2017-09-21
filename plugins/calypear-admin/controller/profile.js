const uuidv4 = require('uuid/v4');
const Accepts = require('accepts');
const Boom = require('boom');


module.exports = {
  searchUserProfiles: function(request, reply) {
    const AppUser = request.server.collections(true).appuser;

    var accessor = AppUser.find()
      .sort('username');

    //Only return active profile by default setting ShowExpired will return expired profiles as well
    if (!(request.query.showExpired == 1)) {
      accessor.where({
        or: [
          {expires: null},
          {expires: {'>': new Date()}},
        ]
      });
    }
    //Search by username
    if (request.query.username) {
      accessor.where({username: {'like': '%'+request.query.username+'%'}});
    }
    //Search by usertype
    if (request.query.userType) {
      accessor.where({userType: query.query.userType});
    }

    accessor.then((userProfiles) => {
      reply.view('profile/list.hbs',{'userProfiles': userProfiles});
    }).catch((err) => {
      reply(err);
    })
  },
  getUserProfile: function(request,reply){
    const AppUser = request.server.collections(true).appuser;

    AppUser.findOne({id: request.params.id}).then((userProfile) => {
      if(userProfile) {
        if (userProfile.userTypes != 'api'){
          userProfile.authentication = '';
        }

        reply.view('profile/show.hbs',{
          'userProfile': userProfile,
          'userTypes': [
            {id: 'real', name: 'real'},
            //{id: 'api', name: 'api'} - Removed API until implemented
          ]
        });
      } else {
        reply(Boom.notFound('No profile with requested id found'));
      }
      //Dont' return these to the renderer for safety unless its an API user

    }).catch((err) => {
      reply(err);
    })
  },
  createUserProfile: function(request, reply) {
    const AppUser = request.server.collections(true).appuser;

    //Check if the user already exists and is valid
    AppUser.find({
      username: request.payload.username,
      or: [
        {expires: null},
        {expires: {'>': new Date()}},
      ]
    }).then((result) => {
      if (result.length > 0) {

        reply(Boom.conflict('Active user with same username already exists'));
      } else {
        var newAppUser = {
          username: request.payload.username,
          userType: request.payload.userType,
        }

        //Set these depending on if they are actually supplied
        //This is the only time an API key can actually be set - other times
        //it is generated
        if (request.payload.authentication) {
          newAppUser.authentication = AppUser.hashPassword(request.payload.authentication);
        } else {
          //No Password = Random UUID Password until the user sets one
          newAppUser.authentication = AppUser.hashPassword(uuidv4());
        }
        //NULL expiration = never
        if (request.payload.expires) {
          newAppUser.expires = reuqest.payload.expires;
        } else {
          newAppUser.expires = null;
        }
        AppUser.create(newAppUser).then((result) => {
          reply.redirect('/admin/profile/'+result.id)
        }).catch((err)=>{
          reply(err);
        });
      }
    }).catch((err)=>{
      reply(err);
    });
  },
  updateUserProfile: function(request,reply){
    const AppUser = request.server.collections(true).appuser;


    AppUser.findOne({id: request.params.id}).then((result) => {
      if (result){

        if (request.payload.authentication != '') {
          //Only users may set their password, API users are just generated a password
          if (result.userType == 'api'){
            result.authentication = AppUser.hashPassword(uuidv4());
          } else {
            result.authentication = AppUser.hashPassword(request.payload.authentication);
          }



        }
        result.username = request.payload.username;
        if ((request.payload.expires) && (request.payload.expires != '')) {
          result.expires = new Date(request.payload.expires);
        } else {
          result.expires = null;
        }

        result.save().then(() => {
          reply.redirect('/admin/profile/'+request.params.id);
        }).catch((err)=>{
          reply(err);
        })
      } else {
        reply(Boom.notFound('No profile with requested id found'));
      }

      //Type can't be changed once created

      //Authentication can only be generated for API type userType
    }).catch((err) => {
      reply(err);
    })
  },
  deleteUserProfile: function(request,reply) {
      const AppUser = request.server.collections(true).appuser;

      AppUser.destroy({id: request.params.id}).then((result) => {
        reply.redirect('/admin/profiles');
      }).catch((err)=>{
        reply(err);
      })
  }
}
