
//  =============================================================================
//  SET UP AND GLOBAL VARIABLES
//  =============================================================================

var crypto                                = require('crypto'),
    request                               = require('request'),
    apn                                   = require('apn'),
    mysql                                 = require('mysql'),
    nodemailer                            = require('nodemailer'),
    connection                            = mysql.createConnection({
                                              host: 'localhost',
                                              port: 3306,
                                              user: 'root',
                                              password: process.env.MYSQL_PASSWORD,
                                              database: 'IC',
                                              multipleStatements: true
                                            });


  // var message                             = new apn.Notification();
  //     message.expiry                      = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  //     message.badge                       = 3;
  //     message.sound                       = "ping.aiff";
  //     message.alert                       = "You have a new message";
  //     message.payload                     = {'state': 'home.map.menu.alumni'}; // custom key's that can be read on the app

  // var options = { production: false,
  //                 "cert": "_certs/apnagent-dev-cert.pem",
  //                 "key": "_certs/apnagent-dev-key.pem"
  //  };

  // var service = new apn.Connection( options );
  //     // console.log( service );
  //     service.on('connected', function() {
  //           console.log("Connected");
  //       });

  //     service.on('timeout', function () {
  //         console.log("Connection Timeout");
  //     });

  //     service.on('disconnected', function() {
  //         console.log("Disconnected from APNS");
  //     });

  //     service.on("transmitted", function(notification, device) {
  //         console.log("Notification transmitted to:" + device.token.toString("hex"));
  //     });

  //     service.on("transmissionError", function(errCode, notification, device) {
  //         console.error("Notification caused error: " + errCode + " for device ", device, 'AND notification', notification);
  //         if (errCode === 8) {
  //             console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
  //         }
  //     });

  // var sampleToken = '<'+ process.env.TEMP_APN_TOKEN +'>';
  // var myDevice = new apn.Device( sampleToken );

      // service.pushNotification(message, myDevice);


//  =============================================================================
//  MAIN FUNTIONS
//  =============================================================================

//  -----------------------------------------------------------------------------
//  send email notification
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  var sendMail                            = function ( email, subject, body ) {
    console.log('++++++++ sendMail ++++++++');
      // var htmlBody = '<b>Hello world</b></br><div style="width:100px; height: 200px; background-color: red;">YOLLO</div>'
      // sendMail( 571377691, 'server was restarted', htmlBody );

      // create reusable transporter object using SMTP transport
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.IC_NOTI_EMAIL,
              pass: process.env.IC_NOTI_PASSW
          }
      });


      var errorLimitDelay = 20; // minutes

      // setup e-mail data with unicode symbols
      var mailOptions = {
          from: 'IC - Info <'+process.env.IC_NOTI_EMAIL+'>', // sender address
          to: email , // list of receivers
          subject: subject, // Subject line
          text: body, // plaintext body
          html: body // html body
          // html: '<b>Hello world</b></br><div class="width:100px; height: 200px; background-color: red;">YOLLO</div>' // html body
      };

      // send mail with defined transport object
      transporter.sendMail( mailOptions, function( body, info ) {
        if ( body ) {
          if ( body.responseCode === 454) {
            // { [Error: Invalid login]
              //    code: 'EAUTH',
              //    response: '454 4.7.0 Too many login attempts, please try again later. ca2sm424696pbc.68 - gsmtp',
              //    responseCode: 454 }
            console.log( "eMail error 454 - Too many login attempts - waiting "+errorLimitDelay+" min and trying again.");
            setTimeouts[ email ].sendEmail = setTimeout(
              function(){
                  callTimer( arguments[0], arguments[1] );
                  console.log( "eMail error 454 - Too many login attempts - waited "+ arguments[3] +" min and attempted again.");
                  sendMail( arguments[0], arguments[1], arguments[2] );
            }, 1000 * 60 * errorLimitDelay, email, subject, body, errorLimitDelay ); // 1 min wait

          } else if ( body.responseCode === 421) {
            // { [Error: Data command failed]
              //    code: 'EENVELOPE',
              //    response: '421 4.7.0 Temporary System Problem.  Try again later (WS). i4sm571837pdl.11 - gsmtp',
              //    responseCode: 421 }
            console.log( "eMail error 421 - Temporary System Problem - waiting "+errorLimitDelay+" min and trying again.");
            setTimeouts[ email ].sendEmail = setTimeout(
              function(){
                  callTimer( arguments[0], arguments[1] );
                  console.log( "eMail error 421 - Temporary System Problem - waited "+ arguments[3] +" min and attempted again.");
                  sendMail( arguments[0], arguments[1], arguments[2] );
            }, 1000 * 60 * errorLimitDelay, email, subject, body, errorLimitDelay ); // 1 min wait

          } else {
            console.log( "email error -", body );
            sendMail( 'adminID', 'mail error', 'The function sendMail got the following error: ' + body );
          }

        } else {
          console.log( 'Message sent: ' + info.response );
        };
      });
    };

// sendMail( 'dev@italiancollective.co', 'From IC', 'Hi you' );

//  -----------------------------------------------------------------------------
//  Test MYSQL
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  var testMysql                           = function ( ) {
    connection.query('SHOW TABLES', function( err, rows, fields ) {
      if (err) throw err;
      console.log('testMysql', rows)
    });
  };

  // testMysql();

//  =============================================================================
//  REQUEST HANDLERS
//  =============================================================================

//  -----------------------------------------------------------------------------
//  / = serve the mail landing page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.main                            = function ( req, res ) {
      console.log('++++++++ main ++++++++');

      // connection.query('SELECT id, ... FROM access_right; SELECT * FROM ...', function( err, results, fields ) {
        // if (err) throw err;

        // var metrics = { access_right: results[0], something_else: results[1], ...: results[2] };

        // res.render('./partials/main.ejs',  metrics );
        res.render('./partials/main.ejs');
      // });
    };




//  -----------------------------------------------------------------------------
//  /login = serve the login page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  exports.hello                           = function ( req, res ) {
      console.log( "===============================" );
      console.log('++++++++ hello ++++++++');
      console.log( "===============================" );
      console.log( "HEADER: ", req.headers );
      // console.log( "HEADER: ", res );
      console.log( "QUERY: ", req.query );
      console.log( "BODY: ", req.body );

      var metrics = {IC: "says hello"};
      res.send( metrics );
    };




//  -----------------------------------------------------------------------------
//  /login = serve the login page
//  -----------------------------------------------------------------------------
    // FROM |
    //      -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
    //  TO  |
//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

