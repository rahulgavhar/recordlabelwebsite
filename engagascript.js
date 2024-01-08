(function(window, document) {

    function initEngaga($) {

        ///
        ///   General Functions
        ///

        function loadCss(src) {
            if (document.createStyleSheet) {
                document.createStyleSheet(src);
            } else {
                $('<link>')
                    .appendTo('head')
                    .attr({ type: 'text/css', rel: 'stylesheet', href: src });
            }
        }

        function setHtml(window, html) {
            var doc;
            if (window.contentWindow) {
                doc = window.contentWindow;
            }
            else if (window.contentDocument && window.contentDocument.document) {
                doc = window.contentDocument.document;
            }
            else if (window.contentDocument) {
                doc = window.contentDocument;
            } else {
                return false;
            }
            doc.document.open('text/html', 'replace');
            doc.document.write(html);
            doc.document.close();
        }

        function createCookie(name, value, seconds) {
            var expires;
            if (seconds) {
                var date = new Date();
                date.setTime(date.getTime() + (seconds * 1000));
                expires = '; expires=' + date.toGMTString();
            } else {
                expires = '';
            }
            document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; path=/';
        }

        function readCookie(name) {
            var nameEQ = encodeURIComponent(name) + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        }

        function parseUrl(url) {
            var parser = document.createElement('a');
            parser.href = url;
            return parser;
        }

        function wildCompare(string, search) {
            var startIndex = 0, array = search.split('*');
            var leadingWildcard = false;
            for (var i = 0; i < array.length; i++) {
                var index;
                if (i == 0) {
                    index = string.substr(0, array[i].length).indexOf(array[i], startIndex);
                } else {
                    index = string.indexOf(array[i], startIndex);
                }
                if (index == -1) return false;
                else startIndex = index + array[i].length;
                leadingWildcard = (array[i].length == 0);
            }
            return (startIndex == string.length || leadingWildcard);
        }

        function isSameSite(site1, site2) {
            site1 = site1.toLowerCase();
            site2 = site2.toLowerCase();
            if (site1.substr(0, 4) != 'www.') {
                site1 = 'www.' + site1;
            }
            if (site2.substr(0, 4) != 'www.') {
                site2 = 'www.' + site2;
            }
            return (site1 === site2);
        }

        function isMobile() {
            function isTouchDevice() {
                return 'ontouchstart' in window // works on most browsers
                        || 'onmsgesturechange' in window; // works on ie10, mostly
            };

            return (isTouchDevice() && (window.screen.width < 480 || window.screen.height < 480));
        }

        function isLandscape() {
            return (window.screen.width > window.screen.height);
        }

        function produceBrandBadge(enabled) {
            if (!enabled) {
                return null;
            }
            var badge = $('<div class="engaga-badge"></div>');
            badge.click(function () {
                window.open('https://www.engaga.com/', '_blank');
            });
            return badge;
        }

        ///
        ///   Dialog Manager
        ///

        function dialogManager(form_settings) {

            function _sendStatistics(activity, successfunc) {

                if (typeof successfunc === 'undefined') {
                    successfunc = null;
                }

                var jqxhr = $.post('https://spark.engaga.com' + '/frontend/statistics/', {
                    url: window.location.href,
                    action: activity,
                });

                if (successfunc != null) {
                    jqxhr.done(successfunc);
                }
            }

            function _placePixel(code) {
                if (code && this.dialog_pixels.indexOf(code) == -1) {
                    this.dialog_pixels.push(code);
                    var pixel = $('<div>', { class: 'engaga-pixel' })
                        .css({ display: 'none' })
                        .html(code);
                    $('body').append(pixel);
                }
            }

            function _placeAppearPixel() {
                if (form_settings.tracking_on_show) {
                    this.placePixel(form_settings.tracking_on_show);
                }
            }

            function _placeSubscribePixel() {
                if (form_settings.tracking_on_complete) {
                    this.placePixel(form_settings.tracking_on_complete);
                }
            }

            function _onFormAppeared() {
                this.has_shown = false;
                this.is_visible = false;
                this.placeAppearPixel();
                this.sendStatistics('show');
                createCookie('engaga_seen_' + form_settings.campaign_uid, 'yes', form_settings.dont_show_again);
            }

            function _onFormHidden() {
                this.is_visible = false;
                if (form_settings.show_on_scroll_down) {
                    $(window).off('scroll', this.scrollEvent);
                }

            }

            function _hideDialog() {
                if (this.overlay_div) {
                    this.overlay_div.css('display', 'none');
                }
                if (this.dialog_div) {
                    this.dialog_div.css('display', 'none');
                }
                if (this.dialog_content && form_settings.animation) {
                    this.dialog_content.removeClass('engaga-animation-' + form_settings.animation);
                }
                this.onFormHidden();
            }

            function _setFormVisible() {

                if (this.overlay_div) {
                    this.overlay_div.css('display', 'block');
                }
                if (!isMobile()) {
                    if (this.dialog_content && form_settings.animation) {
                        this.dialog_content.addClass('engaga-animation-' + form_settings.animation);
                    }
                }
                if (this.dialog_div) {
                    this.dialog_div.css('display', 'block');
                    this.dialog_div.css('opacity', '1');
                    this.dialog_div.css('bottom', '0');
                }

                this.onFormAppeared();
            }

            function _scrollEvent(event) {
                var base = event.data;
                if (!base.has_shown) {
                    var scrolled = ($(window).scrollTop() + $(window).height()) / $(document).height() * 100;
                    if (!form_settings.scroll_percent || scrolled > form_settings.scroll_percent) {
                        base.showDialog(true);
                    }
                }
            }

            function _setFormScrollable() {
                var base = this;

                if (form_settings.show_on_scroll_down) {
                    $(window).on('scroll', base, base.scrollEvent);
                }
            }

            function _showDialog(if_never_shown) {
                if (this.iframe_ready) {
                    if (!if_never_shown || !this.has_shown) {
                        this.setFormVisible()
                    }
                } else {
                    var base = this;
                    setTimeout(function() {
                        base.showDialog(if_never_shown)
                    }, 500); //try again later
                }
            }

            function _enableScrollDialog() {
                if (this.iframe_ready) {
                    this.setFormScrollable()
                } else {
                    var base = this;
                    setTimeout(function() {
                        base.enableScrollDialog()
                    }, 500); //try again later
                }
            }

            function _iframeReady() {
                this.iframe_ready = true;
            }

            function _resizeDialog(w, h, maxwidth) {

                if (isMobile()) {
                    if (isLandscape() && parseInt(maxwidth, 10) > 500) {
                        maxwidth = 400 + 'px';
                        if (w > 400) {
                            w = 400;
                        }
                        this.dialog_div.css('max-width', maxwidth);
                    } else {
                        this.dialog_div.css('max-width', '501px');
                    }

                }

                if (this.dialog_content) {
                    this.dialog_content.css('max-width', maxwidth);
                }

                this.dialog_width = w;
                this.dialog_height = h;
                if (!isMobile()) {
                    if (!this.overlay_div || this.overlay_div.css('display') != 'block') {
                        this.dialog_div.css({ display: 'none' });
                    }
                    this.dialog_iframe.css('height', h + 'px');
                    if (this.dialog_content) {
                        this.dialog_content.css('height', h + 'px');
                    }
                    this.dialog_div.css({ top: '0', left: '0' });
                } else {
                    this.dialog_iframe.css('height', h + 'px');
                    this.dialog_div.css('height', h + 'px');
                    this.dialog_div.css('left', '0');
                    this.dialog_div.css('right', '0');
                    this.dialog_div.css('margin-left', 'auto');
                    this.dialog_div.css('margin-right', 'auto');

                }

                if (!isMobile() && this.dialog_badge) {
                    var base = this;
                    function repositionBadge() {
                        base.dialog_badge.css('top', (base.dialog_content.offset().top + base.dialog_content.height() + 10) + 'px');
                        base.dialog_badge.css('left', Math.round((base.dialog_container.width() - base.dialog_badge.width()) / 2 ) + 'px');
                        setTimeout(function(){
                            repositionBadge();
                        }, 500);
                    }
                    repositionBadge();
                    setTimeout(function(){
                        base.dialog_badge.fadeIn();
                    }, 1500);
                }

            }

            function _getExtraIframeData() {
                return {};
            }

            function _setIframeHtml(html) {
                setHtml(this.dialog_iframe[0], html);
                var win = this.dialog_iframe[0];
                if (this.dialog_iframe[0].contentWindow) {
                    win = this.dialog_iframe[0].contentWindow;
                }
                win.extra_data = this.getExtraIframeData();
            }

            function _getFormId() {
                return this.campaign_id;
            }

            function _getContainerId() {
                return this.campaign_id;
            }

            function _createForm(form_settings) {

                var base = this;

                if (!isMobile()) {
                    this.overlay_div = $('<div>').addClass('engaga-overlay').css('display', 'none');
                    $('body').append(this.overlay_div);
                    this.dialog_div = $('<div>', { id: 'engaga-' + this.dialog_id })
                        .css({ position: 'fixed', left: '-10000px', top: '-10000px' })
                        .addClass('engaga-dialog');
                    this.dialog_container = $('<div>', { id: 'engaga-container-' + this.dialog_id })
                        .addClass('engaga-container');
                    this.dialog_overlay_inner = $('<div>', { id: 'engaga-overlay-inner-' + this.dialog_id })
                        .addClass('engaga-overlay-inner');
                    this.dialog_content = $('<div>', { id: 'engaga-content-' + this.dialog_id })
                        .addClass('engaga-content');
                    this.dialog_iframe = $('<iframe>', { id: 'engaga-frame-' + this.dialog_id, frameborder: 0, scrolling: 'no', 'allowtransparency': true })
                        .css({'height': '0', 'width' : '100%'})
                        .addClass('engaga-frame');
                    this.dialog_div.append(this.dialog_container);
                    this.dialog_container.append(this.dialog_overlay_inner);
                    this.dialog_container.append(this.dialog_content);
                    this.dialog_badge = produceBrandBadge(form_settings.show_brand_link);
                    if (this.dialog_badge) {
                        this.dialog_container.append(this.dialog_badge);
                    }
                    this.dialog_content.append(this.dialog_iframe);

                } else {
                    //mobile
                    this.dialog_div = $('<div>', { id: 'engaga-scrollbox-' + this.dialog_id })
                        .css({
                            position: 'fixed',
                            display: 'block',
                            opacity: '0',
                            left: '0',
                            width: '100%'
                        })
                        .css('bottom', '100%')
                        .addClass('engaga-topbar');
                    this.dialog_iframe = $('<iframe>', { id: 'engaga-frame-' + this.dialog_id, frameborder: 0, scrolling: 'no', 'allowtransparency': true })
                        .css({ height: '0', width: '100%' })
                        .addClass('engaga-frame');
                    this.dialog_div.append(this.dialog_iframe);
                }
                $('body').append(this.dialog_div);
                if (!isMobile()) {
                    this.overlay_div.add(this.dialog_overlay_inner).on('click', function() {
                        base.hideDialog();
                    });
                }
            }

            var dialog = {

                dialog_id : parseInt(1000000 * Math.random()).toString(10),
                iframe_ready : false,
                overlay_div : null,
                dialog_div : null,
                dialog_container : null,
                dialog_overlay_inner : null,
                dialog_content : null,
                dialog_iframe : null,
                dialog_width : 0,
                dialog_height : 0,
                dialog_pixels : [],
                campaign_id : form_settings.campaign_id,
                campaign_uid: form_settings.campaign_uid,
                close_action : form_settings.close_action,
                close_redirect_url : form_settings.close_redirect_url,
                close_redirect_new_tab : form_settings.close_redirect_new_tab,
                has_shown : false,
                system_url: null,

                sendStatistics: _sendStatistics,
                placePixel: _placePixel,
                onFormAppeared: _onFormAppeared,
                onFormHidden: _onFormHidden,
                placeAppearPixel: _placeAppearPixel,
                placeSubscribePixel: _placeSubscribePixel,
                setFormVisible: _setFormVisible,
                setFormScrollable: _setFormScrollable,
                showDialog: _showDialog,
                scrollEvent: _scrollEvent,
                enableScrollDialog: _enableScrollDialog,
                hideDialog: _hideDialog,
                iframeReady: _iframeReady,
                resizeDialog: _resizeDialog,
                getExtraIframeData: _getExtraIframeData,
                setIframeHtml: _setIframeHtml,
                getFormId: _getFormId,
                getContainerId: _getContainerId,
                createForm: _createForm,
                getDialogId: function() { return this.dialog_id },
                getRedirectUrl: function() { return this.close_redirect_url },
                mustRedirectInCurrentTab: function() { return this.close_action == 'redirect' && this.close_redirect_url && !this.close_redirect_new_tab }
            }

            return dialog;
        }

        ///
        ///   Dialog Topbar Manager
        ///

        function dialogTopbarManager(form_settings) {

            var parent = dialogManager(form_settings);
            var pushed = 0;

            function _createForm(form_settings) {
                this.dialog_div = $('<div>', { id: 'engaga-scrollbox-' + this.dialog_id })
                    .css({
                        position: 'fixed',
                        display: 'block',
                        opacity: '0',
                        left: '0',
                        width: '100%',
                        'z-index': '-1000'
                    })
                    .css(form_settings.position_on_screen, 0)
                    .addClass('engaga-topbar');
                this.dialog_iframe = $('<iframe>', { id: 'engaga-frame-' + this.dialog_id, frameborder: 0, scrolling: 'no', 'allowtransparency': true })
                    .css({ height: '0', width: '100%' })
                    .addClass('engaga-frame');
                this.dialog_div.append(this.dialog_iframe);
                this.dialog_badge = produceBrandBadge(form_settings.show_brand_link);
                if (this.dialog_badge) {
                    this.dialog_div.append(this.dialog_badge);
                    var base = this;
                    this.dialog_div.mouseenter(function () {
                        base.dialog_badge.fadeIn();
                    });
                }
                $('body').prepend(this.dialog_div);
            }

            function _resizeDialog(w, h, maxwidth) {
                this.dialog_width = w;
                this.dialog_height = h;
                this.dialog_iframe.css('height', h + 'px');
                this.dialog_div.css('height', h + 'px');
                if (this.is_visible && this.pushed != h) {
                    this.undoPushContent();
                    this.pushContent(this.dialog_height);
                }
                if (this.dialog_badge) {
                    this.dialog_badge.css('top', (this.dialog_div.height() + 5) + 'px');
                    this.dialog_badge.css('right', '5px');
                }
            }

            function _setFormVisible() {
                if (this.dialog_div) {
                    this.dialog_div.css('opacity', '1');
                    this.dialog_div.css('z-index', '');
                }
                this.pushContent(this.dialog_height);

                this.onFormAppeared();
            }

            function _hideDialog() {
                this.undoPushContent();
                parent.hideDialog.call(this);
            }

            function _undoPushContent() {
                if (this.pushed) {
                    this.pushContent(-this.pushed);
                    this.pushed = 0;
                }
            }

            function _pushAbsoluteElements(el, amount) {
                var self = this;
                var pos = el.css('position');
                if (el.is(this.dialog_div) || (el.is(':hidden') && pos == 'fixed') || el.data('engaga-do-not-push') == 1 || el.hasClass('engaga-dialog'))
                    return;
                if (pos == 'absolute' || pos == 'fixed') {
                    var curr_top = parseInt(el.css('top'), 10);
                    var curr_height = parseInt(el.css('height'), 10);
                    if (pos == 'fixed' && curr_top < parseInt(this.dialog_div.css('top'), 10)) {
                        return; //do not push elements that are above dialog
                    }
                    var new_top = curr_top + amount;
                    if ((new_top + curr_height <= parseInt($(window).height(), 10) || curr_height > amount * 4) //do not push elements out of screen unless they are much bigger than pushed amount
                      && curr_top + curr_height > 0 //and do not push elements that are out of screen into screen
                    ) {
                        el.css('top', new_top + 'px');
                    } else {
                        el.data('engaga-do-not-push', 1);
                    }
                } else if (pos != 'relative' && pos != 'sticky') {
                    el.children().each(function(i, el) {
                        self.pushAbsoluteElements($(el), amount);
                    });
                }
            }

            function _pushContent(amount) {
                amount = Math.round(amount);
                if (form_settings.position_on_screen != 'top')
                    return;
                if (amount) {
                    var self = this;
                    var curr_margin = parseInt($('body').css('margin-top'), 10);
                    var new_margin = curr_margin + amount;
                    $('body').css('margin-top', new_margin + 'px');
                    var bodypos = $('body').css('position');
                    if (bodypos != 'absolute' && bodypos != 'relative' && bodypos != 'fixed' && bodypos != 'sticky') {
                        $('body').children().each(function(i, el) {
                            self.pushAbsoluteElements($(el), amount);
                        });
                    }
                }
                this.pushed = amount;
            }

            var self = {
                pushContent: _pushContent,
                undoPushContent: _undoPushContent,
                pushAbsoluteElements: _pushAbsoluteElements
            }

            var overrides = {
                createForm: _createForm,
                resizeDialog: _resizeDialog,
                setFormVisible: _setFormVisible,
                hideDialog: _hideDialog
            }

            var dialog = $.extend(self, parent, overrides);
            return dialog;
        }


        ///
        ///   Dialog Fullscreen Manager
        ///

        function dialogFullscreenManager(form_settings) {

            var parent = dialogManager(form_settings);

            function _createForm(form_settings) {
                this.dialog_div = $('<div>', { id: 'engaga-' + this.dialog_id })
                    .css({ position: 'fixed', left: '-10000px', top: '-10000px', display: 'none' })
                    .addClass('engaga-fullscreen');
                this.dialog_content = $('<div>', { id: 'engaga-content-' + this.dialog_id })
                    .addClass('engaga-content');
                this.dialog_iframe = $('<iframe>', { id: 'engaga-frame-' + this.dialog_id, frameborder: 0, scrolling: 'no', 'allowtransparency': true })
                    .css({'height': '100%', 'width' : '100%'})
                    .addClass('engaga-frame');
                this.dialog_div.append(this.dialog_content);
                this.dialog_content.append(this.dialog_iframe);
                this.dialog_badge = produceBrandBadge(form_settings.show_brand_link);
                if (this.dialog_badge) {
                    this.dialog_content.append(this.dialog_badge);
                }
                $('body').append(this.dialog_div);
            }

            function _resizeDialog(w, h, maxwidth) {
                this.dialog_width = w;
                this.dialog_height = h;
                this.dialog_div.css({ top: '0', left: '0' });
                if (this.dialog_badge) {
                    this.dialog_badge.css('bottom', '10px');
                    this.dialog_badge.css('right', '10px');
                    this.dialog_badge.show();
                }
            }

            var self = {
            }

            var overrides = {
                createForm: _createForm,
                resizeDialog: _resizeDialog
            }

            var dialog = $.extend(self, parent, overrides);
            return dialog;
        }

        ///
        ///   Dialog Scrollbox Manager
        ///

        function dialogScrollboxManager(form_settings) {

            var parent = dialogManager(form_settings);

            var visible = false;

            function _scrollEvent(event) {
                var base = event.data;
                var scrolled = ($(window).scrollTop() + $(window).height()) / $(document).height() * 100;
                if (!form_settings.scroll_percent || scrolled > form_settings.scroll_percent) {
                    if (!visible) {
                        base.dialog_div.css({ opacity: '1', bottom: '0' });
                        visible = true;
                        base.onFormAppeared();
                    }
                } else if (form_settings.hide_on_scroll_up) {
                    if (visible) {
                        base.dialog_div.css({ bottom: '-' + base.dialog_height + 'px'});
                        visible = false;
                    }
                }
            }

            function _createForm(form_settings) {
                this.dialog_div = $('<div>', { id: 'engaga-scrollbox-' + this.dialog_id })
                    .css({
                        position: 'fixed',
                        bottom: '100%',
                        display: 'block',
                        opacity: '0',
                        width : '100%'
                    })
                    .css(form_settings.position_on_screen, 0)
                    .addClass('engaga-scrollbox');
                this.dialog_iframe = $('<iframe>', { id: 'engaga-frame-' + this.dialog_id, frameborder: 0, scrolling: 'no', allowtransparency: true })
                    .css({'height': '0', 'width': '100%'})
                    .addClass('engaga-frame');
                this.dialog_div.append(this.dialog_iframe);
                if (!isMobile()) {
                    this.dialog_badge = produceBrandBadge(form_settings.show_brand_link);
                    if (this.dialog_badge) {
                        this.dialog_div.append(this.dialog_badge);
                        var base = this;
                        this.dialog_div.mouseenter(function () {
                            base.dialog_badge.fadeIn();
                        });
                    }
                }
                $('body').prepend(this.dialog_div);
            }

            function _resizeDialog(w, h, maxwidth) {

                this.dialog_div.css('max-width', maxwidth);

                this.dialog_width = w;
                this.dialog_height = h;
                this.dialog_iframe.css('height', h + 'px');
                if (!isMobile()) {
                    if (this.dialog_badge != null) {
                        this.dialog_badge.css('top', (0 - this.dialog_badge.height() - 10) + 'px');
                        this.dialog_badge.css('left', Math.round((this.dialog_div.width() - this.dialog_badge.width()) / 2) + 'px');
                    }
                }
            }

            function _hideDialog() {
                var base = this;
                if (this.dialog_div) {
                    if (visible) {
                        this.dialog_div.css({ display: 'block', bottom: '-' + this.dialog_height + 'px' });
                        visible = false;
                        setTimeout(function() {
                            base.dialog_div.css({ display: 'none' });
                        }, 500);
                    } else {
                        this.dialog_div.css({ display: 'none' });
                    }
                }

                this.onFormHidden();
            }

            function _moveDialogBelowScreen() {
                if (this.dialog_div) {
                    this.dialog_div.css({ display: 'block', bottom: '-' + this.dialog_height + 'px'});
                    this.dialog_div[0].offsetHeight; //force reflow so that previous css registers before enabling transition
                    this.dialog_div.css({ transition: 'bottom 0.3s ease 0s' });
                }
            }

            function _setFormScrollable() {
                if (!visible) {
                    this.moveDialogBelowScreen();
                }
                parent.setFormScrollable.call(this);
            }

            function _setFormVisible() {
                var base = this;
                if (!visible) {
                    visible = true;
                    this.moveDialogBelowScreen();
                    if (this.dialog_div) {
                        setTimeout(function() {
                            base.dialog_div.css({ opacity: '1', bottom: '0'});
                        }, 1);
                        this.onFormAppeared();
                    }
                }
            }

            var self = {
                moveDialogBelowScreen: _moveDialogBelowScreen
            }

            var overrides = {
                createForm: _createForm,
                resizeDialog: _resizeDialog,
                hideDialog: _hideDialog,
                setFormVisible: _setFormVisible,
                scrollEvent: _scrollEvent,
                setFormScrollable: _setFormScrollable
            }

            var dialog = $.extend(self, parent, overrides);
            return dialog;
        }

        ///
        ///   Dialog Content Form Manager
        ///

        function dialogEmbeddedManager(form_settings, container, index) {

            var parent = dialogManager(form_settings);
            var pushed = 0;

            function _createForm(form_settings) {
                this.dialog_div = $('<div>', { id: 'engaga-embedded-' + this.dialog_id })
                    .css({
                        display: 'none',
                    })
                    .addClass('engaga-embedded');
                this.dialog_iframe = $('<iframe>', { id: 'engaga-frame-' + this.dialog_id, frameborder: 0, scrolling: 'no', 'allowtransparency': true })
                    .css({ height: '0', width: '100%' })
                    .addClass('engaga-frame');
                this.dialog_div.append(this.dialog_iframe);
                this.dialog_badge = produceBrandBadge(form_settings.show_brand_link);
                if (this.dialog_badge) {
                    this.dialog_div.append(this.dialog_badge);
                    var base = this;
                    this.dialog_div.mouseenter(function () {
                        base.dialog_badge.fadeIn();
                    });
                }
                this.engaga_embed_index = index;
                container.prepend(this.dialog_div);
            }

            function _getExtraIframeData() {
                return {
                    engaga_container_index: this.engaga_embed_index
                }
            }

            function _getContainerId() {
                return this.campaign_id + '_' + this.engaga_embed_index;
            }

            function _resizeDialog(w, h, maxwidth) {
                this.dialog_width = w;
                this.dialog_height = h;
                this.dialog_iframe.css('height', h + 'px');
                this.dialog_div.css('height', h + 'px');
                if (this.dialog_badge) {
                    this.dialog_badge.css('top', (this.dialog_div.height() + 5) + 'px');
                    this.dialog_badge.css('right', '0px');
                }
            }

            function _setFormVisible() {
                if (this.dialog_div) {
                    this.dialog_div.css('display', 'block');
                }

                this.onFormAppeared();
            }

            function _hideDialog() {
                parent.hideDialog.call(this);
            }

            var self = {
            }

            var overrides = {
                createForm: _createForm,
                getExtraIframeData: _getExtraIframeData,
                getContainerId: _getContainerId,
                resizeDialog: _resizeDialog,
                setFormVisible: _setFormVisible,
                hideDialog: _hideDialog
            }

            var dialog = $.extend(self, parent, overrides);
            return dialog;
        }

        ///
        ///   Main
        ///

        function createNewDialogs(form_settings, system_url) {
            var dialogs = [];
            if (form_settings.dialog_type == 'scrollbox') {
                dialogs[0] = new dialogScrollboxManager(form_settings);
            } else if (form_settings.dialog_type == 'topbar') {
                dialogs[0] = new dialogTopbarManager(form_settings);
            } else if (form_settings.dialog_type == 'fullscreen') {
                dialogs[0] = new dialogFullscreenManager(form_settings);
            } else if (form_settings.dialog_type == 'embedded') {
                $('div.engaga-embedded-form-' + form_settings.campaign_uid).each(function(i, el) {
                    var dialog = new dialogEmbeddedManager(form_settings, $(el), i);
                    dialogs[dialogs.length] = dialog;
                });
            } else {
                dialogs[0] = new dialogManager(form_settings);
            }
            for (var i = 0; i < dialogs.length; i++) {
              dialogs[i].createForm(form_settings);
              dialogs[i].system_url = system_url;
            }
            return dialogs;
        }

        var dialogs = {};

        var user_id = $('#engaga-script').data('engaga-user-id');
        if (!user_id) {
            return;
        }

        var urla = parseUrl($('#engaga-script').attr('src'));
        urla = urla.protocol + '//' + urla.host;

        $.ajax({
            url: 'https://spark.engaga.com' + '/frontend/' + user_id + '/settings.js',
            jsonpCallback: 'callback',
            dataType: 'jsonp'
        })
        .done(function(data) {

            var settings = data;

            $(document).ready(function() {

                function setShowTimeout(dialog, delay, if_never_shown) {
                    var _dia = dialog;
                    setTimeout(function() {
                        _dia.showDialog(if_never_shown);
                    }, delay);
                }

                function setShowScrollTimeout(dialog, delay) {
                    var _dia = dialog;
                    setTimeout(function() {
                        _dia.enableScrollDialog();
                    }, delay);
                }

                function ajaxLoadDialogContent(dialog, form_settings) {
                    var _dia = dialog;
                    $.ajax({
                        url: 'https://spark.engaga.com' + '/frontend/' + form_settings.user_id + '/' + form_settings.campaign_id + '/campaign.html'
                    })
                    .done(function(data) {
                        _dia.setIframeHtml(data);
                    });
                }

                function allowedByCookies(form_settings) {
                    var samesite = (document.referrer != '' && document.referrer.split('/')[2] == window.location.hostname);
                    var was_visited = (readCookie('engaga_visited_' + form_settings.campaign_uid) == 'yes');
                    var was_visited_again = (readCookie('engaga_visited_again_' + form_settings.campaign_uid) == 'yes');
                    if (!form_settings.dont_show_first_time || (was_visited && (!samesite || was_visited_again))) {
                        if (was_visited && !samesite && !was_visited_again) {
                            createCookie('engaga_visited_again_' + form_settings.campaign_uid, 'yes', 3600 * 24 * 365);
                        }

                        if (!form_settings.dont_show_again || readCookie('engaga_seen_' + form_settings.campaign_uid) != 'yes') {
                            if (readCookie('engaga_subscribed_' + form_settings.campaign_uid) != 'yes') {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                function alwaysAllowed(form_settings) {
                    if (form_settings.dialog_type == 'embedded') {
                        return true;
                    } else {
                        return false;
                    }
                }

                function matchesUrl(mask) {
                    var i = mask.indexOf('://');
                    var altmask = '';
                    if (i == -1) {
                        mask = '*' + mask;
                    } else {
                        var n = mask.indexOf('/', i + 3);
                        if (n == -1) {
                            altmask = mask + '/';
                        }
                    }
                    if (wildCompare(window.location.href, mask)) {
                        return true;
                    } else if (altmask != '' && altmask != mask) {
                        return wildCompare(window.location.href, altmask);
                    } else {
                        return false;
                    }
                }

                function allowedByUrlFilter(form_settings) {
                    var allowed = true;
                    if (form_settings.url_display_on && form_settings.url_display_on.length) {
                        allowed = false;
                        for (var i = 0; i < form_settings.url_display_on.length; i++) {
                            allowed = (allowed || matchesUrl(form_settings.url_display_on[i]));
                        }
                    }
                    if (allowed && form_settings.url_display_off && form_settings.url_display_off.length) {
                        for (var i = 0; i < form_settings.url_display_off.length; i++) {
                            allowed = (allowed && !matchesUrl(form_settings.url_display_off[i]));
                        }
                    }
                    return allowed;
                }

                // Initialization and events

                for (var i = 0; i < settings.forms.length; i++) {

                    var form_settings = settings.forms[i];

                    if (!form_settings.host || isSameSite(form_settings.host, window.location.hostname)) {

                        var dialog_list = createNewDialogs(form_settings, urla);

                        for (var k = 0; k < dialog_list.length; k++) {
                            var dialog = dialog_list[k];
                            dialogs[dialog.getContainerId()] = dialog;

                            if (form_settings.published) {

                                if (allowedByUrlFilter(form_settings) && (alwaysAllowed(form_settings) || allowedByCookies(form_settings))) {

                                    ajaxLoadDialogContent(dialog, form_settings);

                                    if (form_settings.show_on_scroll_down) {
                                        setShowScrollTimeout(dialog, 1);
                                    }

                                    if (form_settings.show_on_load) {
                                        setShowTimeout(dialog, form_settings.show_after_delay, true);
                                    }

                                    if (form_settings.show_on_exit) {
                                        $(document).on('mouseleave', dialog, function handleMouseLeave(e) {
                                            var _dia = e.data;
                                            if (e.clientY < 25) {
                                                setShowTimeout(_dia, 1, true);
                                            }
                                        });
                                    }
                                }
                                createCookie('engaga_visited_' + form_settings.campaign_uid, 'yes', 3600 * 24 * 365);
                            }
                        }
                    }

                }
            });

        });

        $(window).on('message onmessage', function(e) {
            var data = e.originalEvent.data;
            if (typeof data != 'undefined' && data.indexOf && data.indexOf('engaga-message') > -1) {
                var data = $.parseJSON(data);
                var container_id = data.campaign_id;
                if (data.extra_data && typeof data.extra_data.engaga_container_index !== 'undefined') {
                    container_id = container_id + '_' + data.extra_data.engaga_container_index
                }
                var dialog = dialogs[container_id];
                if (dialog && data.campaign_id == dialog.getFormId()) {
                    if (data.msg == 'ready') {
                        dialog.iframeReady();
                        dialog.resizeDialog(data.width, data.height, data.maxwidth);
                    } else if (data.msg == 'resized') {
                        dialog.resizeDialog(data.width, data.height, data.maxwidth);
                    } else if (data.msg == 'closed') {
                        dialog.hideDialog();
                    } else if (data.msg == 'subscribed') {
                        dialog.placeSubscribePixel();
                        dialog.sending_statistics = true;
                        dialog.sendStatistics('convert', function() {
                            dialog.sending_statistics = true;
                            if (dialog.redirectFunction) {
                                dialog.redirectFunction();
                                dialog.redirectFunction = null;
                            }
                        });
                        createCookie('engaga_subscribed_' + data.campaign_uid, 'yes', 3600 * 24 * 365);
                    } else if (data.msg == 'saved') {
                        if (dialog.mustRedirectInCurrentTab()) {
                            var url = dialog.getRedirectUrl();
                            if (url) {
                                dialog.redirectFunction = function() {
                                    window.location.href = url;
                                }
                                if (!dialog.sending_statistics) {
                                    //somehow statistics was quickly sent even before "saved" callback
                                    dialog.redirectFunction();
                                    dialog.redirectFunction = null;
                                }
                            }
                        }
                    }
                }
            }
        });

        loadCss('https://spark.engaga.com' + '/public/site.css')
    }

    
    ///
    ///   jQuery & Start
    ///

    var jquery_vers = '3.1.0';
    var jquery_loaded = false;

    if (!window.jQuery || window.jQuery.fn.jquery != jquery_vers) {
        var script_tag = document.createElement('script');
        script_tag.onload = script_tag.onreadystatechange = function() {
            if (!jquery_loaded) {
                var rs = this.readyState;
                if (!rs || rs == 'loaded' || rs == 'complete') {
                    jquery_loaded = true;
                    var jq = window.jQuery.noConflict(true);
                    initEngaga(jq);
                    jq(script_tag).remove();
                }
            }
        }
        script_tag.type = 'text/javascript';
        script_tag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/' + jquery_vers + '/jquery.min.js';
        (document.getElementsByTagName('head')[0] || doucment.documentElement).appendChild(script_tag);
    } else {
        initEngaga(window.jQuery);
    }
    
})(window, document);
