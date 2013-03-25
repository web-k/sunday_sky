﻿/// <reference path="/LiveSDKHTML/js/wl.js" />
(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    
    ui.Pages.define("/pages/groupedItems/groupedItems.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            WL.Event.subscribe("auth.login", onLoginComplete);
            WL.Event.subscribe("auth.logout", onLogoutComplete);
            WL.init();

            WL.login({
                scope: ["wl.signin", "wl.skydrive"],
            });

        },


    });

    function onLoginComplete() {
      var session = WL.getSession();
      if (!session.error) {
        signedInUser();
      }
    };
    function onLogoutComplete() {
        nav.navigate("/pages/groupedItems/groupedItems.html");
    };
    function signedInUser() {
        $("progress").show();
        WL.api({
            path: "/me",
            method: "get"
        }
        ).then(
        function (result) {
            App.username = result.name;
        });;
        var albums_path = "/me/albums";
        WL.api({ path: albums_path, method: "GET" }).then(function (response) {
            var items = response.data;
            var sunday_sky_item = null;
            for (var i = 0; i < items.length; i++) {
                if (items[i].name == "SundaySky") {
                    sunday_sky_item = items[i];
                    break;
                }
            }
            if (sunday_sky_item) {
                var path = sunday_sky_item.id + "/files";

                WL.api({ path: path, method: "GET" }).then(function (response) {
                    var items = response.data;
                    var updated_time_sorted_items = items.sort(function (a, b) {
                        if (a.updated_time < b.updated_time) return 1;
                        if (a.updated_time > b.updated_time) return -1;
                        return 0;
                    });
                    var photo = updated_time_sorted_items[0];
                    var photo2 = updated_time_sorted_items[1];
                    var photo3 = updated_time_sorted_items[2];
                    var $photo = $("#photo_img1");
                    var $photo2 = $("#photo_img2");
                    var $photo3 = $("#photo_img3");
                    var window_height = $(window).height();
                    var window_width = $(window).width();
                    if (window_height > window_width) {
                        $photo.height(window_height);
                        $photo2.height(window_height);
                        $photo3.height(window_height);
                    } else {
                        $photo.width(window_width);
                        $photo2.width(window_width);
                        $photo3.width(window_width);
                    }
                    $photo.bind("load", function () {
                        $("progress").fadeOut(1000);
                        $(this).css("margin-top", (($(window).height() - $(this).height()) / 2) + "px").delay(1000).fadeIn(1500);
                        $("#footer").delay(1500).fadeIn(1500);
                    });
                    $photo.attr("src", photo.source);
                    $photo.data("description", photo.description);
                    $("#photo_description").text(photo.description);
                    $photo2.bind("load", function () {
                        $back_button.removeClass("disable").addClass("active");
                        $(this).css("margin-top", (($(window).height() - $(this).height()) / 2) + "px");
                    });
                    $photo2.attr("src", photo2.source);
                    $photo2.data("description", photo2.description);
                    $photo2.bind("load", function () {
                        $(this).css("margin-top", (($(window).height() - $(this).height()) / 2) + "px");
                    });
                    $photo3.attr("src", photo3.source);
                    $photo3.data("description", photo3.description);

                    var $back_button = $("#nav_back");
                    var $next_button = $("#nav_next");
                    $back_button.unbind("click").click(function () {
                        if ($back_button.hasClass("active")) {
                            var $showing_photo = $(".photo_img.active");
                            $showing_photo.removeClass("active").addClass("disable");
                            var showing_photo_id = $showing_photo.data("photo-id");
                            var $target_photo = $("#photo_img" + (showing_photo_id == "1" ? "2" : "3"));
                            var description = $target_photo.data("description").length == 0 ? "　" : $target_photo.data("description");
                            $("#photo_description").text(description);
                            $target_photo.removeClass("disable").addClass("active");
                            $(".photo_img").fadeOut(1500);
                            $target_photo.delay(750).fadeIn(1500);
                            if (showing_photo_id == "1") {
                                $next_button.removeClass("disable").addClass("active");
                            } else {
                                $back_button.removeClass("active").addClass("disable");
                            }
                        }
                    });
                    $next_button.unbind("click").click(function () {
                        if ($next_button.hasClass("active")) {
                            var $showing_photo = $(".photo_img.active");
                            $showing_photo.removeClass("active").addClass("disable");
                            var showing_photo_id = $showing_photo.data("photo-id");
                            var $target_photo = $("#photo_img" + (showing_photo_id == "3" ? "2" : "1"));
                            var description = $target_photo.data("description").length == 0 ? "　" : $target_photo.data("description");
                            $("#photo_description").text(description);
                            $target_photo.removeClass("disable").addClass("active");
                            $(".photo_img").fadeOut(1500);
                            $target_photo.delay(750).fadeIn(1500);
                            if (showing_photo_id == "3") {
                                $back_button.removeClass("disable").addClass("active");
                            } else {
                                $next_button.removeClass("active").addClass("disable");
                            }
                        }
                    });
                });
            }
        });
    };
    function getUserPicture() {
        WL.api
        ({
            path: "me/picture",
            method: "get"
        }).then(function (result) {
            $("#meImg").attr("src", result.location);
            $("#meImg").css("visibility", "visible");
        });
        
      
    };

})();
