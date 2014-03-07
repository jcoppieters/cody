//
// Johan Coppieters - mar 2013 - cody
//
//
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("../../cody/index.js");
var nodemailer = require("nodemailer");


function ContactController(context) {
  console.log("ContactController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);
  
	// init inherited controller
	cody.Controller.call(this, context);
}

ContactController.prototype = Object.create( cody.Controller.prototype );
module.exports = ContactController;



ContactController.prototype.doRequest = function( finish ) {

  if (! this.doCrudRequest(finish)) {
    cody.Controller.prototype.doRequest.call(this, finish);
  }
};



ContactController.prototype.doDelete = function( theId, finish ) {
  var self = this;
  
  this.query("delete from contacts where id = ?", [], function() {
    if (err) {
      self.feedBack(false, "Failed to delete the contact");
    } else {
      self.feedBack(true, "Successfully deleted the contact");
    }
    finish();
  });
};

	
ContactController.prototype.doSave = function( theId, finish ) {
  var self = this;
  cody.Contact.getContact( self, theId, function(aContact) {
    aContact.scrapeFrom(self);
    aContact.doUpdate(self, function() {
      if (aContact.id === self.getLoginId()) {
        self.setLogin(aContact);
      }
      self.feedBack(true, "Successfully saved the contact");
      finish();
    });    
  });
};


ContactController.prototype.doGet = function(id, finish) {
  var self = this;
  
  self.doGetRefs( function() {
    if (isNaN(id) || (id <= 0)) {
      self.context.contact = {id: 0};
      finish();
    } else {
      this.query("select * from contacts where id = ?", [id], function(err, result) {
        if (result.length > 0)
          self.context.contact = result[0];
        else
          self.context.contact = {};
        finish();
      });
    }
  });
};


ContactController.prototype.doGetRefs = function(finish) {
  var self = this;

  this.query("select * from targets order by name", function(err, result) {
    self.context.targets = result;
    finish();
  });
};

ContactController.prototype.doList = function(finish) {
  var self = this;

  this.query("select * from contacts ", [], function(err, result) {
    self.context.contacts = result;
    
    self.doGetRefs(finish);
  });
};

ContactController.prototype.sendEmail = function (pFrom, pTo, pSubject, pText) {
    console.log("Sending email from " + pFrom + " to " + pTo);

    var mailOptions = {
        from: pFrom, // sender address
        to: pTo, // list of receivers
        subject: pSubject, // Subject line
        html: pText // HTML body
    };

    //TODO: for production, modify this to use /usr/bin/sendmail
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "relay.skynet.be ", //change this to match your server
        secureConnection: false,
        port: 25/*,
         auth: {
         contact: "contact@domain.com",
         pass: "password"
         }                   */
    });

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log("Error sending mail: " + error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });

};

/*
create table contacts (
 id int(11) not null primary key auto_increment,
 cie varchar(127),
 name varchar(127),
 title varchar(32),
 email varchar(127),
 phone varchar(32),
 origin varchar(15),
 target varchar(31),
 active char(1) default 'Y',
 nomail char(1) default 'N'
);

insert into contacts (cie, name,title, email, phone) values('4U Solutions BVBA','Gekiere Ruben', 'zaakvoerder', 'ruben@gekiere.com', '+32 494232018');
insert into contacts (cie, name,title, email, phone) values('Accenture','De troyer Stephanie', 'Recruiting', 'stephanie.de.troyer@accenture.com', '+32 2 226 7015');
insert into contacts (cie, name,title, email, phone) values('Acrona','Denoo Nick', 'zaakvoerder', 'nick.denoo@acrona.be', '+32 474 88 48 57');
insert into contacts (cie, name,title, email, phone) values('Ad ULtima','Catry Christophe ', 'HR manager', 'christophe.catry@adultima.be', '+32 497  43 92 70');
insert into contacts (cie, name,title, email, phone) values('Adam Software','Coppens Sven', '(leeg)', 'sven.coppens@adamsoftware.net', '+32 9 381 63 36');
insert into contacts (cie, name,title, email, phone) values('Adifo NV','Schillewaert Leen', 'HRM', 'leen.schillewaert@adifo.be', '+32 50 303 268');
insert into contacts (cie, name,title, email, phone) values('ADMB','jacobs gert', 'ICT Infra & Support', 'gert.jacobs@admb.be', '+3250475111');
insert into contacts (cie, name,title, email, phone) values('ADMB','Van Loo Koen', 'CIO', 'koen.vanloo@admb.be', '+32 50 474 501');
insert into contacts (cie, name,title, email, phone) values('AZ Sint-Augustinus Veurne','Boydens Didier', 'Diensthoofd administratie & IT', 'Didier.Boydens@azsav.be', '+32 58 33 37 36');
insert into contacts (cie, name,title, email, phone) values('AZ Sint-Augustinus Veurne','Tavernier Goedele', 'stafmedewerker', 'g.tavernier@azsav.be', '+32 58 33 35 91');
insert into contacts (cie, name,title, email, phone) values('AZ Sint-Jan Brugge-Oostende','De Neve Helga', 'Directeur ICT', 'helga.deneve@azsintjan.be', '+32 50 452269');
insert into contacts (cie, name,title, email, phone) values('BARC','Baeyens Els', 'IT Infrastructure Manager', 'els.baeyens@barclab.com', '+32 9 329 23 37');
insert into contacts (cie, name,title, email, phone) values('Barco','Bertier Lieven', 'E-marketing manager', 'lieven.bertier@barco.com', '+32 476524421');
insert into contacts (cie, name,title, email, phone) values('Barco','Crombez Marieke', 'Internship Coordinator', 'stages@barco.com', '+ 32 56 36 8784');
insert into contacts (cie, name,title, email, phone) values('Barco','Nonque Gaëtan', 'Product Manager', 'gaetan.nonque@barco.com', '+32 498 10 88 62');
insert into contacts (cie, name,title, email, phone) values('Barco','Schillewaert Annemie', '(leeg)', 'annemie.schillewaert@barco.com', '+ 32 56 36 8784');
insert into contacts (cie, name,title, email, phone) values('Barco','Vermeiren Saskia', 'Recruiter', 'saskia.vermeiren@barco.com', '+32 56 36 86 60');
insert into contacts (cie, name,title, email, phone) values('Barco','Ryon Lynn', 'Media Relations Specialist', 'lynn.ryon@barco.com', '+32 56368166');
insert into contacts (cie, name,title, email, phone) values('Be.Advised - CloudsShop','duron bart', 'zaakvoerder', 'bart@beadvised.be', '+32 50316636');
insert into contacts (cie, name,title, email, phone) values('Biodroid  Productions','Flores Santos Ricardo', 'Gen Mgr', 'rflores@biodroid-entertainment.com', '+351 93 6257615');
insert into contacts (cie, name,title, email, phone) values('BZYC','Denegri Philippe', 'Bestuur', 'philippe.denegri@telenet.be', '+32 473 632743');
insert into contacts (cie, name,title, email, phone) values('CAT Solutions BVBA','De Graeve Filip', 'consultant', 'filip@catsolutions.be', '0477 63 90 77');
insert into contacts (cie, name,title, email, phone) values('Centric Belgium nv','Defijn Ann', 'HR Advisor', 'ann.defijn@centric.eu', '+32 32229954');
insert into contacts (cie, name,title, email, phone) values('Cloud Innovation','Carly Pieterjan', 'Lead Technical Consultant', 'pieterjan.carly@cloudinnovation.be', '+32487462902');
insert into contacts (cie, name,title, email, phone) values('CompuFit','Casteleyn Ike', 'Projectleider', 'ike@compufit.be', '+32 59 27 05 74');
insert into contacts (cie, name,title, email, phone) values('Dienstenaanhuis','Theuwis Peter', 'ICT Verantwoordelijke. Bestuurder.', 'peter@dienstenaanhuis.be', '+32 473 52 22 73');
insert into contacts (cie, name,title, email, phone) values('DNA Interactif Fashion','Fijen Huub', 'Manager', 'hfij@dna-if.com', '+32 499 99 84 41');
insert into contacts (cie, name,title, email, phone) values('DNA Interactif Fashion BVBA','Fijen Huub', 'Manager', 'hfij@dna-if.com', '+32 499 99 84 41');
insert into contacts (cie, name,title, email, phone) values('Docbyte NV','lenoir annelore', 'Account Manager', 'annelore.lenoir@docbyte.com', '+32 9 242 87 34');
insert into contacts (cie, name,title, email, phone) values('e-BO Enterprises','Dhaene Christophe', 'CEO', 'christophe.dhaene@ebo-enterprises.com', '+3257230270');
insert into contacts (cie, name,title, email, phone) values('EduCentrum vzw','Craeye Pascal', 'projectmedewerker', 'pascal@klascement.net', '+32 495 134591');
insert into contacts (cie, name,title, email, phone) values('encima','Ferdinande Tom', 'zaakvoerder', 'info@encima.be', '');
insert into contacts (cie, name,title, email, phone) values('enetricity','Bogaert Lieven', 'zaakvoerder', 'lieven@enetricity.com', '+32 495263636');
insert into contacts (cie, name,title, email, phone) values('enetricity','Cheng Haissi', 'HR verantwoordelijke', 'haissi@enetricity.com', '+32 50 95 09 53');
insert into contacts (cie, name,title, email, phone) values('ePagine','Bruyneel Ann', 'Customer Relations Manager', 'bruyneel.a@titelive.be', '+32 69 89 00 00');
insert into contacts (cie, name,title, email, phone) values('Eye-t part of Neo Consult','Van Leynseele Pascale', 'zaakvoerder', 'p.vanleynseele@eye-t.be', '+32 50673135');
insert into contacts (cie, name,title, email, phone) values('Eye-t part of Neo Consult','Vande Velde Olivier', 'solution manager', 'o.vandevelde@eye-t.be', '+32 50 67 31 35');
insert into contacts (cie, name,title, email, phone) values('five seasons','De Vuyst Geert', 'zaakvoerder', 'geert@fiveseasons.be', '+3256325617');
insert into contacts (cie, name,title, email, phone) values('FlandersIT Services bvba','Rousseeuw Bart', 'zaakvoerder', 'bart@fits.be', '+32 50501976');
insert into contacts (cie, name,title, email, phone) values('FOODPAIRING','Van Oyen Anthony', 'IT coördinator', 'info@foodpairing.com', '+32 50 36 75 00');
insert into contacts (cie, name,title, email, phone) values('Go-Mobile','Vackier Erwin', 'CTO', 'erwin@go-mobile.be', '+32477500482');
insert into contacts (cie, name,title, email, phone) values('goudengids.be','Cuypers Tom', 'HR coordinator', 'tom.cuypers@goudengids.be', '+32 3 205 44 53');
insert into contacts (cie, name,title, email, phone) values('HBOV','Callant Kris', 'ICT-coördinator', 'kris.callant@hbov.be', '+32 50 30 18 95');
insert into contacts (cie, name,title, email, phone) values('Hudson','Bruggheman Kristof', 'Senior IT Developer', 'kristof.bruggheman@hudson.com', '+32 9 242 53 36');
insert into contacts (cie, name,title, email, phone) values('iadvise nv','Vallaeys Frederik', 'Contactpersoon Hogescholen', 'frederik.vallaeys@iadvise.be', '');
insert into contacts (cie, name,title, email, phone) values('Ideaal. - vrij secundair onderwijs - in Deinze en Aalter','Van Canneyt Koen', 'stafmedewerker', 'info@scholenideaal.be', '+32 9 381 63 85');
insert into contacts (cie, name,title, email, phone) values('ILVO','Allegaert Wim', 'Databank manager', 'wim.allegaert@ilvo.vlaanderen.be', '+32 59 34 22 50 ');
insert into contacts (cie, name,title, email, phone) values('ILVO','Robbens Johan', 'SectieHoofd', 'Johan.Robbens@ilvo.vlaanderen.be', '+32 59569850');
insert into contacts (cie, name,title, email, phone) values('In4Matic NV','Campe Rudy', 'Stagegever', 'rudy.campe@i4m.be', '+32 485 18 42 21');
insert into contacts (cie, name,title, email, phone) values('Index nv','Vandaele Philip', 'Bestuurder', 'philip@index.be', '+32 58/33.25.24');
insert into contacts (cie, name,title, email, phone) values('Integreat','Cordier Wim', 'zaakvoerder', 'wim@integreat.be', '+32 56617897');
insert into contacts (cie, name,title, email, phone) values('Ipsos Belgium','De Block Luc', 'ICT Manager', 'luc.deblock@ipsos.com', '+32 9 216 22 16');
insert into contacts (cie, name,title, email, phone) values('J4S BVBA','Veys Isabel', 'zaakvoerder', 'isabel.veys@j4s.be', '');
insert into contacts (cie, name,title, email, phone) values('Jacops NV','Vandevelde Stefaan', 'Projectleider', 'stefaan.vandevelde@jacops.be', '+32477890654');
insert into contacts (cie, name,title, email, phone) values('JOROSOFT BVBA','Haeghebaert Geert', 'zaakvoerder', 'geerth@jorosoft.be', '+32 50 62 56 66');
insert into contacts (cie, name,title, email, phone) values('LVD Company','Cornelus Alexander', 'Senior Designer', 'acnl@lvd.be', '+32 56 43 06 04');
insert into contacts (cie, name,title, email, phone) values('LVD Company','Rosseel Simon', 'Software Application Developer', 'srss@lvd.be', '+32 56 43 06 47');
insert into contacts (cie, name,title, email, phone) values('LVD Company NV','Vergauwe Karel', 'Software Engineer', 'kvgw@lvd.be', '+ 32 56 43 0808');
insert into contacts (cie, name,title, email, phone) values('Marine Harvest Pieters','Van Gutschoven Sylvain', 'IT Director', 'Sylvain.van.gutschoven@marineharvest.com', '050.458748');
insert into contacts (cie, name,title, email, phone) values('Marlon','Mouton Vincent', 'zaakvoerder', 'vincent@marlon.be', '+32 9 329 06 76');
insert into contacts (cie, name,title, email, phone) values('Mateva Belgium','Vanblaere Ingrid', 'HR', 'ingrid@tcmb.eu', '+32 475 77 17 05');
insert into contacts (cie, name,title, email, phone) values('Mens Sana Marke','Kindt Barbele', 'Bedrijfsleider', 'info@menssanamarke.be', '+32 56/25 44 10');
insert into contacts (cie, name,title, email, phone) values('Mentoring Systems BVBA','Poelvoorde Sabrina', 'Managing director', 'sabrina.poelvoorde@mentoringsystems.be', '+32 50 68 30 38');
insert into contacts (cie, name,title, email, phone) values('MH bvba','Barremaecker Matthias', 'Bedrijfsleider', 'matthias@mh.be', '+32 50 81 39 96');
insert into contacts (cie, name,title, email, phone) values('Microsoft Innovation Center Brussels','Roux Pénélope', 'Operational Director', 'penelope@mic-brussels.be', '+32496298400');
insert into contacts (cie, name,title, email, phone) values('MiramirO vzw','Bosschaert Eva', 'Zakelijke Leiding', 'eva@miramiro.be', '+32 9 324 36 63');
insert into contacts (cie, name,title, email, phone) values('Monest','Keppens Aldwin', 'CTO', 'aldwin@monest.net', '');
insert into contacts (cie, name,title, email, phone) values('OCMW ROESELARE','Pauwels Jan', 'Diensthoofd ICT', 'jan.pauwels@ocmw-roeselare.be', '+32 477521780');
insert into contacts (cie, name,title, email, phone) values('OTYS Belgium bvba','Brausch Peter', 'Managing director', 'peter.brausch@otys.be', '+32 498 40 97 95');
insert into contacts (cie, name,title, email, phone) values('PCS Computer Knokke','Demuynck Peter', 'Algemeen directeur', 'peter@pcsknokke.be', '+32475811027');
insert into contacts (cie, name,title, email, phone) values('Pirsol','Thienpont Pierre', 'Bedrijfsleider', 'info@pirsol.be', '+32 497404002');
insert into contacts (cie, name,title, email, phone) values('Prophets','Clijsters Peter', 'Studio Manager', 'pclijsters@prophets.be', '+32 (0)3 216 16 65');
insert into contacts (cie, name,title, email, phone) values('PvO','Van Driessche Joost', 'Algemeen Directeur ', 'joostvandriessche@pvo.be', '+32 475352572');
insert into contacts (cie, name,title, email, phone) values('Q2C NV','Decroos Sigurd', 'Software Manager', 'sd@q2c.be', '+32 478 23 26 65');
insert into contacts (cie, name,title, email, phone) values('Real Internet Solutions','Ghekiere Kurt', 'CTO', 'kurt@ris.be', '+32 56 32 50 28');
insert into contacts (cie, name,title, email, phone) values('RealDolmen','Adams Geert', '(leeg)', 'geert.adams@realdolmen.com', '+32 2 362 55 55 ');
insert into contacts (cie, name,title, email, phone) values('RealDolmen','De Block Ellen', 'Talent Officer', 'ellen.deblock@realdolmen.com', '+32 2 362 55 55');
insert into contacts (cie, name,title, email, phone) values('RealDolmen','Pauwels Gert', 'Unit Manager CRM', 'gert.pauwels@realdolmen.com', '+32 475 60 14 11');
insert into contacts (cie, name,title, email, phone) values('RealDolmen','Poelmans Joris', 'ECM Unit manager', 'joris.poelmans@realdolmen.com', '+32497828534');
insert into contacts (cie, name,title, email, phone) values('RealDolmen','Vanderlinden Kim', 'HR Recruitment Assistant', 'kim.vanderlinden@realdolmen.com ', '+32 2 801 51 25');
insert into contacts (cie, name,title, email, phone) values('Roularta Media Group','Corneillie Kathy ', 'Coördinator Werving en Selectie', 'sollicitatie@roularta.be', '+32 51 26 61 11');
insert into contacts (cie, name,title, email, phone) values('Roularta Media Group','Vandierendonck Thomas', 'Adjunct IT Directeur', 'thomas.vandierendonck@roularta.be', '+32 51 26 63 05');
insert into contacts (cie, name,title, email, phone) values('Roularta Media Group','Vanhaelewyn Hilde', 'HR Support', 'hilde.vanhaelewyn@roularta.be', '');
insert into contacts (cie, name,title, email, phone) values('Scholen Onze-Lieve-Vrouw Presentatie, Sint-Niklaas','Demeyer Mark', 'ICT coördinator', 'ict@olvp.be', '+32 3 760 08 68');
insert into contacts (cie, name,title, email, phone) values('Sensotec NV','De Prêtre William ', 'Developer', 'william.depretre@sensotec.be', '+32 50 39 49 49      ');
insert into contacts (cie, name,title, email, phone) values('Sofico','Martens Corinne', 'HR', 'corinne.martens@sofico.be', '+32 9 210 80 40');
insert into contacts (cie, name,title, email, phone) values('Stad Gent','Clauwaert Freya', 'Consulent', 'freya.clauwaert@gent.be', '+32 9 266 75 72');
insert into contacts (cie, name,title, email, phone) values('Stad Gent','Denys Guy', 'ICT-Co&#246;rdinator', 'guy.denys@gent.be', '+32 479/99.11.27');
insert into contacts (cie, name,title, email, phone) values('Stad Gent','Moreau Isabelle', 'Communicatiecoördinator', 'isabelle.moreau@gent.be', '+32 9 266 74 65');
insert into contacts (cie, name,title, email, phone) values('Stad Gent','Van Nieuwenhove Tom', 'stafmedewerker', 'tom.vannieuwenhove@gent.be', '+32 478 78 60 47');
insert into contacts (cie, name,title, email, phone) values('Stad Gistel','Vansevenant Jan', 'communicatieambtenaar', 'gemeentebestuur@gistel.be', '+32 59 27 02 26');
insert into contacts (cie, name,title, email, phone) values('Stardekk BVBA','Dierckens Tony', 'Account / Project Manager', 'tony@stardekk.be', '+32474174859');
insert into contacts (cie, name,title, email, phone) values('SunGard','Van Royen Stefaan ', 'R&D Manager', 'stefaan.vanroyen@sungard.com', '+32 15 743 197');
insert into contacts (cie, name,title, email, phone) values('TapCrowd NV','Vermeulen Miquël', 'Founder', 'miquel.vermeulen@tapcrowd.com', '+32472991947');
insert into contacts (cie, name,title, email, phone) values('THE REFERENCE','SCHROYENS FREDERIC', 'HEAD OF MOBILE AND TABLETS', 'FSCHROYENS@REFERENCE.BE', '+32 9 266 19 78');
insert into contacts (cie, name,title, email, phone) values('True Story','Smet Stef', 'Digital Director', 'stef@truestory.be', '+32 497 454 793');
insert into contacts (cie, name,title, email, phone) values('Vlaams Instituut voor de Zee (VLIZ)','Vanhoorne Bart', 'IT Specialist', 'bart.vanhoorne@vliz.be', '+32 59 34 01 59');
insert into contacts (cie, name,title, email, phone) values('Volvo IT','Bart De Vos', 'Manager Application Delivery - Consulting Services', 'bart.de.vos@volvo.com', '+32 250 48 89');
insert into contacts (cie, name,title, email, phone) values('Vrije Universiteit Brussel','Ceuppens Elke', 'Hr Development Officer', 'elke.ceuppens@vub.ac.be', '+32 2/629.11.68');
insert into contacts (cie, name,title, email, phone) values('Winking bvba','Staelens Gerdi', 'zaakvoerder', 'gst@winking.be', '+32 51 23 24 80');
insert into contacts (cie, name,title, email, phone) values('Xando bvba','Jacobs Sébastien', 'Managing partner', 'sebastien.jacobs@xando.be', '+32 9 388 377 0');
insert into contacts (cie, name,title, email, phone) values('XIO cvba','Lagast Fred', 'Project manager', 'iwanttowork@xio.be', '+32 9 330 62 85');
insert into contacts (cie, name,title, email, phone) values('Televic Education nv','Stubbe Brecht', 'senior Research Associate', 'b.stubbe@televic.com', '+32 51 30 30 45');
insert into contacts (cie, name,title, email, phone) values('Televic Education nv','Vandekerckhove Liselotte', 'Management Assistant IT - R&D', 'L.Vandekerckhove@televic.com', '');
insert into contacts (cie, name,title, email, phone) values('Televic Education nv','Michael Catrysse', '-', 'm.catrysse@televic.com', '+32 51 30 30 45');
insert into contacts (cie, name,title, email, phone) values('Attentia NV','Vermeire Tim', 'Business Manager', 'timvermeire@stillmovin.be', '+32 497894722');
insert into contacts (cie, name,title, email, phone) values('Vandemoortele NV','Joris Cindy', 'Human Resources Manager Gent', 'cindy.joris@vandemoortele.com', '+32 9/242.45.81');
insert into contacts (cie, name,title, email, phone) values('SNT CVO','Duhayon Sophie', 'Technisch Adviseur Coordinator ICT', 'sophie@snt.be', '+32 50337669');
insert into contacts (cie, name,title, email, phone) values('Soenen Werkhuizen','De Wit Els', 'HR Director', 'Els.dewit@soenen.com', '+32 51 26 27 57');
insert into contacts (cie, name,title, email, phone) values('KiCo vzw','Demol Bart', 'Secretaris', 'bart.demol@skynet.be', '+32 475 255993');
insert into contacts (cie, name,title, email, phone) values('Pidgon','Wostyn Thijs', 'Point Guard (CEO)', 'thijs@pidgon.com', '+32 474452728');

 */