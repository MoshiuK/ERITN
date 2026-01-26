$(document).ready(function () {
  var tutorialsUrl = $("#TutorialsUrl");
  var homeContent = "The <b>Home Page</b> is your starting point to browse the resources, events, tasks and messages relevant to your organization.";
  var shortTutorialLink = "";
  if (tutorialsUrl.val()) {
    homeContent += "<hr/>Not sure where to start? <a href=\"" + tutorialsUrl.val() + "\" target=\"_blank\"><b>Check out our tutorials.</b></a>";
    shortTutorialLink = "<a id='shortUrl' class='btn btn-link hidden m-b' href=\"" + tutorialsUrl.val() + "\" target=\"_blank\"><small>Learn more from video tutorials.</small></a>";
  }

  var completedTour = "";
  const tour = new Tour({
    basePath: location.pathname,
    storage: false,
    backdrop: true,
    onHidden: function () { $("#backdropFallback").removeClass("hide"); },
    onShown: function () { $("#backdropFallback").addClass("hide"); },
    template: "<div class='popover tour'> " +
      "<div class='arrow'></div> " +
      "<h3 class='popover-title'></h3> " +
      "<div class='popover-content'></div> " +
      "<div class='popover-navigation'> " +
      "<div>" +
      shortTutorialLink +
      "</div>" +
      "<button class='btn btn-default' data-role='prev'>« Prev</button> " +
      "<span data-role='separator'>|</span> " +
      "<button class='btn btn-info' data-role='next'>Next »</button> <button id='gotItButton' class='btn btn-primary pull-right hidden' data-role='end'>Got It!</button>" +
      "</div> " +
      "</div>",
    onEnd: function () {
      $("#backdropFallback").addClass("hide");
      $.ajax({
        url: "/Organizations/Home/UpdateTourMemento",
        method: "POST",
        data: { tourCompleted: completedTour }
      }).done(function () { });
    }
  });
  if (window.location.toString().indexOf("SendInvitations") >= 0) {
    completedTour = "Invitations";
    tour.addStep({
      element: "#generateLinkButton",
      title: "Generate Invitation Link",
      content: "Distribute the <b>invitation link</b> to your members to allow them " +
        "to enroll."
    });

    tour.addStep({
      element: "#RecipientsForm_Recipients",
      title: "Send Invitations in Bulk",
      content: "Add multiple mobile phone numbers and/or email address here  " +
        "if you wish to send out invitations in bulk."
    });

    tour.addStep({
      element: "#sendInvitationsButton",
      title: "Send Invitations",
      content: "Once the above list above is populated with email address and/or phone numbers " +
        "click here to send them.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else if (window.location.toString().indexOf("PeopleHub") >= 0) {
    completedTour = "People";
    tour.addStep({
      element: "#addSomeoneButton",
      title: "Add People",
      content: "Click here to add a person manually or via an invite.",
      placement: "bottom"
    });

    tour.addStep({
      element: "#peopleListFilter",
      title: "Search",
      content: "Search your personnel.",
      placement: "bottom"
    });

    tour.addStep({
      element: "#peopleTab",
      title: "People Tab",
      content: "The <b>People Tab</b> lets you view and manage your registered personnel."
    });

    tour.addStep({
      element: "#enrollmentsTab",
      title: "Enrollments Tab",
      content: "See what is happening with the people you have invited. Send reminders " +
        "to follow up with those that have not enrolled."
    });

    tour.addStep({
      element: "#verificationsTab",
      title: "Verifications Tab",
      content: "<b>Verify</b> the information your personnel submit so that you " +
               "can approve them to receive Reentry/Authorization placards.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else if (window.location.toString().indexOf("EventHub") >= 0) {
    completedTour = "EventHub";
    tour.addStep({
      orphan: true,
      title: "Events Hub",
      content: "All events pertaining to your organization will be shown here. " +
        "Click on the arrow for any of the events to view and distribute access passes.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else if (window.location.toString().indexOf("Enrollment") >= 0) {
    completedTour = "Enrollment";
    tour.addStep({
      element: "#defaultLocation",
      title: "Default Location",
      content: "This default location is used when someone isn't specifically assigned a location."
    });

    tour.addStep({
      element: "#defaultAccessLevel",
      title: "Default Access Level",
      content: "This default access level is used when someone isn't specifically assigned an access level."
    });

    tour.addStep({
      element: "#defaultPurpose",
      title: "Purpose",
      content: "This default purpose is used when someone isn't specifically assigned a purpose.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else if (window.location.toString().indexOf("Event") >= 0) {
    completedTour = "Event";

    tour.addStep({
      element: "#sendCredentialButton",
      title: "Send Credentials",
      content: "Use the <b>Send Credentials</b> function to send the selected members their " +
        "credentials."
    });

    tour.addStep({
      element: "#reissueCredentialButton",
      title: "Reissue Credentials",
      content: "Use the <b>Reissue Credentials</b> button to reissue credentials when a person's information is updated."
    });

    tour.addStep({
      element: "#downloadCredentialsButton",
      title: "Download Credentials",
      content: "Use the <b>Download Credentials</b> function to download the credentials for the members " +
        "selected below."
    });

    tour.addStep({
      element: "#rosterTab",
      title: "Roster Tab",
      content: "Use the <b>Event Roster</b> to manage who is responding to this event from " +
        "your organization and ensure they have the appropriate level of access."
    });

    tour.addStep({
      element: "#mapTab",
      title: "Map Tab",
      content: "Get an overview of where your personnel transit to and thru on this map of the " +
        "emergency zone. Only personnel using our mobile application will be shown."
    });

    tour.addStep({
      element: "#activityTab",
      title: "Activity Tab",
      content: "Get a tabular view of the activity for your personnel. Useful to report on who is in, out " +
        "and helps resolve access problems quickly."
    });

    tour.addStep({
      element: "#credentialTab",
      title: "Pick Up Tab",
      content: "Any personnel that don't have email or mobile access? Use <b>Pickup</b> to download their " +
        "passes to your computer and print them out so personnel can pick them up at a time and " +
        "location that works for them.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else if (window.location.toString().indexOf("Payment") >= 0) {
    completedTour = "Payment";

    tour.addStep({
      element: "#addOrder",
      title: "Add Order",
      content: "Use the <b>Add Order</b> button to order additional member licenses."
    });

    tour.addStep({
      element: "#ordersTable",
      title: "Orders Table",
      content: "The <b>Orders Table</b> lists all your orders."
    });

    tour.addStep({
      element: "#allOrders",
      title: "Year Filter",
      content: "<b>Filter</b> your orders by year using these buttons."
    });

    tour.addStep({
      element: "#detailsButton",
      title: "Order Details",
      content: "Use the <b>Details Button</b> to view a monthly detailed breakdown of personnel and payments.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else if (window.location.toString().indexOf("Settings") >= 0) {
    completedTour = "Settings";

    tour.addStep({
      element: "#general",
      title: "General Settings",
      content: "This page is where you can update your organization's contact information."
    });

    tour.addStep({
      element: "#logo",
      title: "Logo",
      content: "Set your organization's <b>Logo</b> here."
    });

    tour.addStep({
      element: "#locations",
      title: "Locations",
      content: "Set the <b>locations</b> that your organization will respond to on this page."
    });

    tour.addStep({
      element: "#support",
      title: "Support",
      content: "Use this tab to mange the <b>Support</b> functions of your organization."
    });

    tour.addStep({
      element: "#enrollment",
      title: "Enrollment Preferences",
      content: "Set the email/mobile preferences for your organization and personnel on this page."
    });

    tour.addStep({
      element: "#verification",
      title: "Verifications",
      content: "Set <b>Verification</b> preferences here."
    });

    tour.addStep({
      element: "#coordinators",
      title: "coordinators",
      content: "View and manage other <b>Coordinators</b> using this tab.",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }
  else {
    completedTour = "Home";
    tour.addStep({
      element: ".navbar-brand",
      title: "<b>Welcome to the Access Program!</b>",
      content: homeContent,
      placement: "bottom"
    });

    tour.addStep({
      element: "#peopleHubNavItem",
      title: "People Hub",
      content: "The <b>People Hub</b> allows you to manage your personnel, invite people to participate, and verify their " +
               "information to ensure they receive their Reentry/Authorization credentials.",
      placement: "bottom"
    });

    tour.addStep({
      element: "#eventHubNavItem",
      title: "Event Hub",
      content: "The <b>Events Hub</b> shows emergency events relevant to your organization, lets you download and " +
               "send Reentry/Authorization credentials, and gives you real-time situational awareness on your response effort.",
      placement: "bottom"
    });

    tour.addStep({
      element: ".toolbar-profile",
      title: "Organization Settings",
      content: "The <b>Organization Settings</b> allow you to see your registration information, point(s) of contact, and email/mobile preferences.",
      placement: "bottom"
    });

    tour.addStep({
      element: "#activeMemberCard",
      title: "Active Personnel",
      content: "Manage <b>Active Personnel</b> in your organization.",
      placement: "top"
    });

    tour.addStep({
      element: "#enrollmentsPendingCard",
      title: "Enrollments",
      content: "Add and manage <b>Enrollments</b> to get personnel into your organization.",
      placement: "top"
    });

    tour.addStep({
      element: "#verificationsPendingCard",
      title: "Verifications",
      content: "Review and approve <b>Verifications</b> for your personnel.",
      placement: "top"
    });

    tour.addStep({
      element: "#actionsSummaryCard",
      title: "Actions",
      content: "Manage and complete <b>Actions</b> that are assigned to you.",
      placement: "top"
    });

    tour.addStep({
      element: "#messagesSummaryCard",
      title: "Messages",
      content: "View and manage <b>Messages</b> that have been sent to you.",
      placement: "top",
      onShown: function () {
        $("#backdropFallback").addClass("hide");
        $("#gotItButton").removeClass("hidden");
        $("#shortUrl").removeClass("hidden");
      }
    });
  }

  tour.init().start(true);
});