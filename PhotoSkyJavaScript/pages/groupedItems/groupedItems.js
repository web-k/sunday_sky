/// <reference path="/LiveSDKHTML/js/wl.js" />
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
        signedInUser(false);
      }
    };
    function onLogoutComplete() {
        nav.navigate("/pages/groupedItems/groupedItems.html");
    };
    var last_items = null;
    function signedInUser(is_reloaded) {
        if (!is_reloaded) { $("progress").show(); }
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
                    var is_items_updated = true;
                    if (is_reloaded) {
                        for (var i = 0; i < 3; i++) {
                            is_items_updated = false;
                            if (updated_time_sorted_items[0].id != last_items[0].id) {
                                is_items_updated = true;
                                break;
                            }
                        }
                    }
                    last_items = updated_time_sorted_items;
                    if (is_items_updated) {
                        var $main_content = $("#content");
                        var $back_button = $("#nav_back");
                        var $next_button = $("#nav_next");
                        $back_button.removeClass("active").addClass("disable");
                        $next_button.removeClass("active").addClass("disable");
                        if (is_reloaded) { $("progress").show(); }
                        $("#photo_img1, #photo_img2, #photo_img3").remove();
                        var photo = updated_time_sorted_items[0];
                        var photo2 = updated_time_sorted_items[1];
                        var photo3 = updated_time_sorted_items[2];
                        var $photo = $('<img id="photo_img1" class="active photo_img" data-photo-id="1" />');
                        var $photo2 = $(' <img id="photo_img2" class="disable photo_img" data-photo-id="2" />');
                        var $photo3 = $('<img id="photo_img3" class="disable photo_img" data-photo-id="3" />');
                        $main_content.append($photo).append($photo2).append($photo3);
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
                        var description = photo.description.length == 0 ? "　" : photo.description;
                        $photo.data("description", description);
                        $("#photo_description").text(description);
                        $photo2.bind("load", function () {
                            $back_button.removeClass("disable").addClass("active");
                            $(this).css("margin-top", (($(window).height() - $(this).height()) / 2) + "px");
                        });
                        $photo2.attr("src", photo2.source);
                        $photo2.data("description", photo2.description);
                        $photo3.bind("load", function () {
                            $(this).css("margin-top", (($(window).height() - $(this).height()) / 2) + "px");
                        });
                        $photo3.attr("src", photo3.source);
                        $photo3.data("description", photo3.description);

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
                    }
                });

                setTimeout(function () {
                    signedInUser(true);
                }, 10*1000);
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
