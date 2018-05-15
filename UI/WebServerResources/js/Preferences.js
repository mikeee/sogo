!function(){"use strict";angular.module("SOGo.PreferencesUI",["ui.router","ck","angularFileUpload","SOGo.Common","SOGo.MailerUI","SOGo.ContactsUI","SOGo.Authentication","as.sortable"]).config(e).run(t),e.$inject=["$stateProvider","$urlRouterProvider"];function e(e,t){e.state("preferences",{abstract:!0,views:{preferences:{templateUrl:"preferences.html",controller:"PreferencesController",controllerAs:"app"}}}).state("preferences.general",{url:"/general",views:{module:{templateUrl:"generalPreferences.html"}}}).state("preferences.calendars",{url:"/calendars",views:{module:{templateUrl:"calendarsPreferences.html"}}}).state("preferences.addressbooks",{url:"/addressbooks",views:{module:{templateUrl:"addressbooksPreferences.html"}}}).state("preferences.mailer",{url:"/mailer",views:{module:{templateUrl:"mailerPreferences.html"}}}),t.otherwise("/general")}t.$inject=["$rootScope"];function t(e){e.$on("$routeChangeError",function(e,t,a,r){console.error(e,t,a,r)})}}(),function(){"use strict";e.$inject=["$timeout","$mdDialog","FileUploader","Dialog","sgSettings","Account","defaults","account","accountId","mailCustomFromEnabled"];function e(e,t,a,r,i,s,n,o,c,u){var f=this,d=new s({id:c,security:o.security});f.defaultPort=143,f.defaults=n,f.account=o,f.accountId=c,f.customFromIsReadonly=function(){return!(c>0||u)},f.onBeforeUploadCertificate=function(e){f.form=e,f.uploader.clearQueue()},f.removeCertificate=function(){d.$removeCertificate().then(function(){delete f.account.security.hasCertificate})},f.importCertificate=function(){f.uploader.queue[0].formData=[{password:f.certificatePassword}],f.uploader.uploadItem(0)},f.cancel=function(){t.cancel()},f.save=function(){t.hide()},f.hostnameRE=c>0?/^(?!(127\.0\.0\.1|localhost(?:\.localdomain)?)$)/:/./,f.account.encryption?"ssl"==f.account.encryption&&(f.defaultPort=993):f.account.encryption="none",h(),f.uploader=new a({url:[i.activeUser("folderURL")+"Mail",c,"importCertificate"].join("/"),autoUpload:!1,queueLimit:1,filters:[{name:p,fn:p}],onAfterAddingFile:function(e){f.certificateFilename=e.file.name},onSuccessItem:function(t,a,r,i){this.clearQueue(),e(function(){_.assign(f.account,{security:{hasCertificate:!0}})}),h()},onErrorItem:function(e,t,a,i){r.alert(l("Error"),l("An error occurred while importing the certificate. Verify your password."))}});function h(){f.account.security&&f.account.security.hasCertificate&&d.$certificate().then(function(e){f.certificate=e},function(){delete f.account.security.hasCertificate})}function p(e){var t=e.type.indexOf("pkcs12")>0||/\.(p12|pfx)$/.test(e.name);return f.form.certificateFilename.$setValidity("fileformat",t),t}}angular.module("SOGo.PreferencesUI").controller("AccountDialogController",e)}(),function(){"use strict";e.$inject=["$scope","$window","$mdDialog","filter","mailboxes","labels"];function e(e,t,a,r,i,s){var n=this,o=t.sieveCapabilities,c=t.forwardEnabled;t.vacationEnabled;n.filter=r,n.mailboxes=i,n.labels=s,n.cancel=function(){a.cancel()},n.hasRulesAndActions=function(){var e=[n.filter.actions];"allmessages"!=n.filter.match&&e.push(n.filter.rules);return _.every(e,function(e){return e&&e.length>0})},n.save=function(e){a.hide()},n.addMailFilterRule=function(e){n.filter.rules||(n.filter.rules=[]);n.filter.rules.push({field:"subject",operator:"contains"})},n.removeMailFilterRule=function(e){n.filter.rules.splice(e,1)},n.addMailFilterAction=function(e){n.filter.actions||(n.filter.actions=[]);n.filter.actions.push({method:"discard"})},n.removeMailFilterAction=function(e){n.filter.actions.splice(e,1)},n.fieldLabels={subject:l("Subject"),from:l("From"),to:l("To"),cc:l("Cc"),to_or_cc:l("To or Cc"),size:l("Size (Kb)"),header:l("Header")},o.indexOf("body")>-1&&(n.fieldLabels.body=l("Body")),n.methodLabels={discard:l("Discard the message"),keep:l("Keep the message"),stop:l("Stop processing filter rules")},c&&(n.methodLabels.redirect=l("Forward the message to")),o.indexOf("reject")>-1&&(n.methodLabels.reject=l("Send a reject message")),o.indexOf("fileinto")>-1&&(n.methodLabels.fileinto=l("File the message in")),(o.indexOf("imapflags")>-1||o.indexOf("imap4flags")>-1)&&(n.methodLabels.addflag=l("Flag the message with")),n.numberOperatorLabels={under:l("is under"),over:l("is over")},n.textOperatorLabels={is:l("is"),is_not:l("is not"),contains:l("contains"),contains_not:l("does not contain"),matches:l("matches"),matches_not:l("does not match")},o.indexOf("regex")>-1&&(n.textOperatorLabels.regex=l("matches regex"),n.textOperatorLabels.regex_not=l("does not match regex"))}angular.module("SOGo.PreferencesUI").controller("FiltersDialogController",e)}(),function(){"use strict";e.$inject=["$q","$window","$state","$mdMedia","$mdSidenav","$mdDialog","$mdToast","sgSettings","sgFocus","Dialog","User","Account","Preferences","Authentication"];function e(e,t,a,r,i,s,n,o,c,u,f,d,h,p){var m,g=this,C=[],w=(new Date).beginOfDay();this.$onInit=function(){this.preferences=h,this.passwords={newPassword:null,newPasswordConfirmation:null},this.timeZonesList=t.timeZonesList,this.timeZonesSearchText="",this.sieveVariablesCapability=t.sieveCapabilities.indexOf("variables")>=0,this.mailLabelKeyRE=new RegExp('^[^(){} %*"\\\\]*$'),o.activeUser("path").mail&&(m=new d({id:0})).$getMailboxes().then(function(){for(var e=m.$flattenMailboxes({all:!0}),t=-1,a=e.length;++t<a;)C.push(e[t])}),h.defaults.SOGoAlternateAvatar&&(f.$alternateAvatar=h.defaults.SOGoAlternateAvatar),this.updateVacationDates()},this.go=function(e,t){t.$valid&&(r("gt-sm")||i("left").close(),a.go("preferences."+e))},this.onLanguageChange=function(e){e.$valid&&u.confirm(l("Warning"),l("Save preferences and reload page now?"),{ok:l("Yes"),cancel:l("No")}).then(function(){g.save(e,{quick:!0}).then(function(){t.location.reload(!0)})})},this.addCalendarCategory=function(e){this.preferences.defaults.SOGoCalendarCategoriesColors["New category"]="#aaa",this.preferences.defaults.SOGoCalendarCategories.push("New category"),c("calendarCategory_"+(this.preferences.defaults.SOGoCalendarCategories.length-1)),e.$setDirty()},this.removeCalendarCategory=function(e,t){var a=this.preferences.defaults.SOGoCalendarCategories[e];this.preferences.defaults.SOGoCalendarCategories.splice(e,1),delete this.preferences.defaults.SOGoCalendarCategoriesColors[a],t.$setDirty()},this.addContactCategory=function(e){var t=_.indexOf(this.preferences.defaults.SOGoContactsCategories,"");t<0&&(this.preferences.defaults.SOGoContactsCategories.push(""),t=this.preferences.defaults.SOGoContactsCategories.length-1),c("contactCategory_"+t),e.$setDirty()},this.removeContactCategory=function(e,t){this.preferences.defaults.SOGoContactsCategories.splice(e,1),t.$setDirty()},this.addMailAccount=function(e,a){var r;this.preferences.defaults.AuxiliaryMailAccounts.push({}),r=_.last(this.preferences.defaults.AuxiliaryMailAccounts),angular.extend(r,{isNew:!0,name:"",identities:[{fullName:"",email:""}],receipts:{receiptAction:"ignore",receiptNonRecipientAction:"ignore",receiptOutsideDomainAction:"ignore",receiptAnyAction:"ignore"}}),s.show({controller:"AccountDialogController",controllerAs:"$AccountDialogController",templateUrl:"editAccount?account=new",targetEvent:e,locals:{defaults:this.preferences.defaults,account:r,accountId:this.preferences.defaults.AuxiliaryMailAccounts.length-1,mailCustomFromEnabled:t.mailCustomFromEnabled}}).then(function(){a.$setDirty()}).catch(function(){g.preferences.defaults.AuxiliaryMailAccounts.pop()})},this.editMailAccount=function(e,a,r){var i=this.preferences.defaults.AuxiliaryMailAccounts[a];s.show({controller:"AccountDialogController",controllerAs:"$AccountDialogController",templateUrl:"editAccount?account="+a,targetEvent:e,locals:{defaults:this.preferences.defaults,account:i,accountId:a,mailCustomFromEnabled:t.mailCustomFromEnabled}}).then(function(){g.preferences.defaults.AuxiliaryMailAccounts[a]=i,r.$setDirty()},function(){})},this.removeMailAccount=function(e,t){this.preferences.defaults.AuxiliaryMailAccounts.splice(e,1),t.$setDirty()},this.resetMailLabelValidity=function(e,t){t["mailIMAPLabel_"+e].$setValidity("duplicate",!0)},this.addMailLabel=function(e){guid();this.preferences.defaults.SOGoMailLabelsColorsKeys.push("label"),this.preferences.defaults.SOGoMailLabelsColorsValues.push(["New label","#aaa"]),c("mailLabel_"+(_.size(this.preferences.defaults.SOGoMailLabelsColorsKeys)-1)),e.$setDirty()},this.removeMailLabel=function(e,t){this.preferences.defaults.SOGoMailLabelsColorsKeys.splice(e,1),this.preferences.defaults.SOGoMailLabelsColorsValues.splice(e,1),t.$setDirty()},this.addMailFilter=function(e,t){var a={match:"all",active:1};s.show({templateUrl:"editFilter?filter=new",controller:"FiltersDialogController",controllerAs:"filterEditor",targetEvent:e,locals:{filter:a,mailboxes:C,labels:this.preferences.defaults.SOGoMailLabelsColors}}).then(function(){g.preferences.defaults.SOGoSieveFilters||(g.preferences.defaults.SOGoSieveFilters=[]),g.preferences.defaults.SOGoSieveFilters.push(a),t.$setDirty()})},this.editMailFilter=function(e,t,a){var r=angular.copy(this.preferences.defaults.SOGoSieveFilters[t]);s.show({templateUrl:"editFilter?filter="+t,controller:"FiltersDialogController",controllerAs:"filterEditor",targetEvent:null,locals:{filter:r,mailboxes:C,labels:this.preferences.defaults.SOGoMailLabelsColors}}).then(function(){g.preferences.defaults.SOGoSieveFilters[t]=r,a.$setDirty()})},this.removeMailFilter=function(e,t){this.preferences.defaults.SOGoSieveFilters.splice(e,1),t.$setDirty()},this.addDefaultEmailAddresses=function(e){var a=[];angular.isDefined(this.preferences.defaults.Vacation.autoReplyEmailAddresses)&&(a=this.preferences.defaults.Vacation.autoReplyEmailAddresses.split(",")),this.preferences.defaults.Vacation.autoReplyEmailAddresses=_.union(t.defaultEmailAddresses.split(","),a).join(","),e.$setDirty()},this.userFilter=function(e,t){return e.length<o.minimumSearchLength()?[]:f.$filter(e,t).then(function(e){return _.forEach(e,function(e){e.$$image||(e.image?e.$$image=e.image:g.preferences.avatar(e.c_email,32,{no_404:!0}).then(function(t){e.$$image=t}))}),e})},this.confirmChanges=function(e,a){var r;if(a.$dirty&&a.$valid){for(e.preventDefault(),e.stopPropagation(),r=e.target;"A"!=r.tagName;)r=r.parentNode;u.confirm(l("Unsaved Changes"),l("Do you want to save your changes made to the configuration?"),{ok:l("Save"),cancel:l("Don't Save")}).then(function(){g.save(a,{quick:!0}).then(function(){t.location=r.href})},function(){t.location=r.href})}},this.save=function(a,r){var i,s,o,c,f,d;if(s=!0,f=[],t.forwardConstraints>0&&angular.isDefined(this.preferences.defaults.Forward)&&this.preferences.defaults.Forward.enabled&&angular.isDefined(this.preferences.defaults.Forward.forwardAddress))for(o=this.preferences.defaults.Forward.forwardAddress.split(","),c=t.defaultEmailAddresses.split(/, */),_.forEach(c,function(e){var t=e.split("@")[1];t&&f.push(t.toLowerCase())}),i=0;i<o.length&&s;i++)d=o[i].split("@")[1].toLowerCase(),f.indexOf(d)<0&&1==t.forwardConstraints?(u.alert(l("Error"),l("You are not allowed to forward your messages to an external email address.")),s=!1):f.indexOf(d)>=0&&2==t.forwardConstraints&&(u.alert(l("Error"),l("You are not allowed to forward your messages to an internal email address.")),s=!1);return this.preferences.defaults.SOGoMailLabelsColorsKeys.length==this.preferences.defaults.SOGoMailLabelsColorsValues.length&&this.preferences.defaults.SOGoMailLabelsColorsKeys.length==_.uniq(this.preferences.defaults.SOGoMailLabelsColorsKeys).length||(u.alert(l("Error"),l("IMAP labels must have unique names.")),_.forEach(this.preferences.defaults.SOGoMailLabelsColorsKeys,function(e,t,r){a["mailIMAPLabel_"+t].$dirty&&(r.indexOf(e)!=t||r.indexOf(e,t+1)>-1)&&(a["mailIMAPLabel_"+t].$setValidity("duplicate",!1),s=!1)})),s?this.preferences.$save().then(function(e){r&&r.quick||(n.show(n.simple().content(l("Preferences saved")).position("bottom right").hideDelay(2e3)),a.$setPristine())}):e.reject()},this.canChangePassword=function(){return!!(this.passwords.newPassword&&this.passwords.newPassword.length>0&&this.passwords.newPasswordConfirmation&&this.passwords.newPasswordConfirmation.length&&this.passwords.newPassword==this.passwords.newPasswordConfirmation)},this.changePassword=function(){p.changePassword(this.passwords.newPassword).then(function(){var e=s.alert({title:l("Password"),content:l("The password was changed successfully."),ok:l("OK")});s.show(e).finally(function(){e=void 0})},function(e){var t=s.alert({title:l("Password"),content:e,ok:l("OK")});s.show(t).finally(function(){t=void 0})})},this.timeZonesListFilter=function(e){return _.filter(this.timeZonesList,function(t){return t.toUpperCase().indexOf(e.toUpperCase())>=0})},this.updateVacationDates=function(){var e=this.preferences.defaults;e&&e.Vacation&&e.Vacation.enabled&&(this.toggleVacationStartDate(),this.toggleVacationEndDate())},this.toggleVacationStartDate=function(){var e;(e=this.preferences.defaults.Vacation).startDateEnabled&&e.endDateEnabled&&e.startDate.getTime()>e.endDate.getTime()&&(e.startDate=new Date(e.endDate.getTime()),e.startDate.addDays(-1))},this.toggleVacationEndDate=function(){var e;(e=this.preferences.defaults.Vacation).endDateEnabled&&e.startDateEnabled&&e.endDate.getTime()<e.startDate.getTime()&&(e.endDate=new Date(e.startDate.getTime()),e.endDate.addDays(1))},this.validateVacationStartDate=function(e){var t=g.preferences.defaults,a=!0;return t&&t.Vacation&&t.Vacation.enabled&&t.Vacation.startDateEnabled&&(a=(!t.Vacation.endDateEnabled||e.getTime()<t.Vacation.endDate.getTime())&&e.getTime()>=w.getTime()),a},this.validateVacationEndDate=function(e){var t=g.preferences.defaults,a=!0;return t&&t.Vacation&&t.Vacation.enabled&&t.Vacation.endDateEnabled&&(a=(!t.Vacation.startDateEnabled||e.getTime()>t.Vacation.startDate.getTime())&&e.getTime()>=w.getTime()),a}}angular.module("SOGo.PreferencesUI").controller("PreferencesController",e)}();
//# sourceMappingURL=Preferences.js.map