(function ($) {
    $.fn.sylect = function (options) {
        // plugin variables
        var _this    = this,
            settings = $.extend({
                multiple: false,
                chained: null,
                showListItem: 5,
                searchPlaceholder: 'Liste İçinde Ara...'
            }, options)

        function checkChained(optionChained = '') {
            if (settings.chained != null) {
                var chainedByText = $(settings.chained).val() != null ? $(settings.chained).val().toString().trim() : '';
                var optionChained = optionChained.toString().trim();
                if (optionChained == chainedByText) {
                    return true;
                }
                return false;
            }
            return true;
        }

        function _searchIn(text, search) {
            var loweredText  = text.toLocaleLowerCase();
            var loweredSeach = search.toLocaleLowerCase();
            if (loweredText.search(loweredSeach) !== -1 || loweredSeach === '') {
                return true
            }
            return false;
        }

        var selectedCollection = {
            indexes: [],
            text: ""
        }

        function setSelectedCollection() {
            _this.find('option').each(function (index) {
                if ($(this).attr('selected') === "selected") {
                    if (settings.multiple === true) {
                        selectedCollection.indexes.push(index);
                        selectedCollection.text += `
                            <span class="chip chip-sm">
                                ${$(this).text()}
                                <span class="chip-button" data-index="${index}"></span>
                            </span>
                        `
                    } else {
                        selectedCollection.text = $(this).text()
                        selectedCollection.indexes = [];
                        selectedCollection.indexes.push(index);
                    }

                }
            })
            if (selectedCollection.text === "") {
                selectedCollection.text = settings.searchPlaceholder;
            }
        }

        function isSelected(optionIndex) {
            if (selectedCollection.indexes.indexOf(optionIndex) !== -1) {
                return ' class="active" ';
            }
            return '';
        }


        function createInitDom() {
            setSelectedCollection();
            _this.css('display', 'none');
            var selectOptionDom = '';
            _this.find('option').each(function (index) {
                if (checkChained($(this).data('chained'))) {
                    var dataChained = typeof $(this).data('chained') !== "undefined" ? ' data-chained="' + $(this).data('chained') + '"' : '';
                    selectOptionDom += `
                        <li data-index="${index}" ${dataChained} ${isSelected(index)} >${$(this).text()}</li>
                    `;
                }
            })
            _this.parent().append(`
                <div class="sylect">
                    <div class="sylect-input">${selectedCollection.text}</div>
                    <div class="sylect-drop">
                        <div class="sylect-search">
                            <label class="fa-icon fa-search"></label>
                            <input type="text" placeholder="${settings.searchPlaceholder}">
                        </div>
                        <ul>
                            ${selectOptionDom}
                        </ul>
                    </div>
                </div>
            `);
        }
        createInitDom();

        // Local Variables
        var dropdown      = _this.next().find('.sylect-drop'),
            searchInput   = _this.next().find('input'),
            selectEl      = _this.next().find('.sylect-input'),
            optionEl      = _this.find('option'),
            maxH          = settings.showListItem * (_this.next().find('li').innerHeight() + 2);

        _this.next().find('ul').css('max-height', maxH + 'px');

        function isActiveClass(optionIndex, optionText) {
            var selectInputText = ''
            if (settings.multiple === true) {
                _this.next().find('.chip').each(function () {
                    var chipButtonDataIndex = $(this).find('.chip-button').data('index');
                    if (chipButtonDataIndex == optionIndex) {
                        selectInputText = $(this).text();
                    }
                })
            } else {
                selectInputText = selectEl.text();
            }
            return optionText.trim() === selectInputText.trim() ? 'class=active' : '';
        }

        function refreshList() {
            _this.next().find('ul').remove();
            _this.next().find('p').remove();
            var liDom = '';
            optionEl.each(function (index) {
                var optionText = $(this).text();
                if (_searchIn($(this).text(), searchInput.val())) {
                    if (checkChained($(this).data('chained'))) {
                        var dataChained = typeof $(this).data('chained') !== "undefined" ? ` data-chained="${$(this).data('chained')}"` : '';
                        liDom += `<li ${isActiveClass(index, optionText)} data-index="${index}" ${dataChained}> ${$(this).text()} </li>`;
                    }
                }
            })
            var appendText = '<p class="pad-15 fc-danger">Listenizde Eşleşen Bir Madde Bulunamadı</p>'
            if (liDom !== '')
                appendText = '<ul>' + liDom + '</ul>';

            dropdown.append(`${appendText}`)

            if (liDom !== '')
                _this.next().find('ul').css('max-height', maxH + 'px');
        }
        function clearValue() {
            _this.next().find('li').removeClass('active').siblings().removeClass('active');
            optionEl.prop('selected', false).removeAttr('selected');
            selectEl.text('');
            searchInput.val('');
        }

        // Chained Function
        $(settings.chained).on('change', function () {
            clearValue();
            refreshList();
        })

        // Search Input Keyup Event
        this.next().on('keyup', 'input', function () {
            refreshList()
        })

        // Open & Close State Event
        selectEl.on('click', function (e) {
            if (!$(e.target).hasClass('chip-button')) {
                var clickedId = _this.attr('id');
                $('.sylect').each(function () {
                    if ($(this).prev().attr('id') === clickedId) {
                        $(this).transitionEffect();
                    }
                    else {
                        $(this).transitionEffect({state: 'leave'});
                    }
                })
            }
        });

        // Chip Click Event
        this.next().on('click', '.chip-button', function (e) {
            var chipDataIndex = $(this).data('index')
            selectEl.text('');
            optionEl.eq(chipDataIndex).prop('selected', false).removeAttr('selected');
            _this.next().find('li').each(function () {
                if ($(this).data('index') == chipDataIndex) {
                    $(this).removeClass('active');
                }
            });
            _this.find('option').each(function (index) {
                if ($(this).is('[selected]')) {
                    selectEl.append(`
                        <span class="chip chip-sm">
                            ${$(this).text()}
                            <span class="chip-button" data-index="${index}"></span>
                        </span>
                    `)
                }
            })
        })

        // White Space or Another Element Click Control
        $(document).on('click', function (event) {
            var hidden = true;
            $(event.target).parents().each(function () {
                if ($(this).hasClass('sylect') === true) {
                    hidden = false;
                }
            });
            if($(event.target).hasClass('chip-button')) {
                hidden = false;
            }
            if (hidden === true) {
                $('.sylect').each(function () {
                    $(this).transitionEffect({state: 'leave'});
                });
            }
        });

        // Selected Option Event
        this.next().on('click', 'li', function () {
            if (settings.multiple === false) {
                hasActiveClass = $(this).hasClass('active');
                clearValue();

                if (!hasActiveClass) {
                    $(this).addClass('active');
                    optionEl.eq($(this).data('index')).prop('selected', true).attr('selected', 'selected');
                    selectEl.text($(this).text());
                }

                // Close Dropdown, Clear Search Input and Refresh Drop List
                _this.next().transitionEffect({state: "leave", afterLeaveFn: function () {
                    refreshList();
                }});
            } else {
                hasActiveClass = $(this).hasClass('active');
                if (!hasActiveClass) {
                    $(this).addClass('active');
                    optionEl.eq($(this).data('index')).prop('selected', true).attr('selected', 'selected');
                } else {
                    optionEl.eq($(this).data('index')).prop('selected', false).removeAttr('selected');
                    $(this).removeClass('active');
                }
                selectEl.text('');
                _this.find('option').each(function (index) {
                    if ($(this).is('[selected]')) {
                        var optionText = $(this).text();
                        selectEl.append(`
                            <span class="chip chip-sm">
                                ${optionText}
                                <span class="chip-button" data-index="${index}"></span>
                            </span>
                        `)
                    }
                })
            }
            // Jquery Change Trigger
            _this.trigger('change');
            // Native Change Trigger
            var evt = document.createEvent('Events');
            evt.initEvent('change', true, false);
            document.getElementById(_this.attr('id')).dispatchEvent(evt);
        })

        // Plugin Prototype Function
        $.fn.sylect.refresh = function () {
            clearValue();
            refreshList();
            return this;
        }
        return this;
    }
}(jQuery))