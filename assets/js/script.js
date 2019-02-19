$(function() {
    var maxWidth = 500,
        maxHeight = 500,
        photo = $('#photo'),
        originalCanvas = null,
        filters = $('#filters li a'),
        filterContainer = $('#filterContainer');


    photo.fileReaderJS({
        on:{
            load: function(e, file) {
                var img = $('<img>').appendTo(photo),
                    imgWidth, newWidth,
                    imgHeight, newHeight,
                    ratio;
                
                photo.find('canvas').remove();
                filters.removeClass('active');

                img.load(function() {
                    imgWidth = this.width;
                    imgHeight = this.height;

                    if(imgWidth >= maxWidth || imgHeight >= maxHeight) {
                        if(imgWidth > imgHeight) {
                            ratio = imgWidth / maxWidth;
                            newWidth = maxWidth;
                            newHeight = imgHeight / ratio;
                        }else{
                            ratio = imgHeight / maxHeight;
                            newHeight = maxHeight;
                            newWidth = imgWidth / ratio;
                        }
                    }else{
                        newHeight = imgHeight;
                        newWidth = imgWidth;
                    }

                    originalCanvas = $('<canvas>');
                    var originalContext = originalCanvas[0].getContext('2d');

                    originalCanvas.attr({
                        width: newWidth,
                        height: newHeight
                    }).css({
                        marginTop: -newHeight / 2,
                        marginLeft: -newWidth / 2
                    });

                    originalContext.drawImage(this, 0, 0, newWidth, newHeight)

                    img.remove();

                    filterContainer.fadeIn();
                    filters.first().click();
                });

                img.attr('src', e.target.result);
            },

            beforestart: function(file){
                return /^image/.test(file.type);
            }
        }
    });

    filters.click(function(e) {
        e.preventDefault();

        var f = $(this);

        if(f.is('.active')){
            return false;
        }

        filters.removeClass('active');
        f.addClass('active');

        var clone = originalCanvas.clone();

        clone[0].getContext('2d').drawImage(originalCanvas[0], 0, 0);

        photo.html(clone);

        var effect = $.trim(f[0].id);

        Caman(clone[0], function() {
            if(effect in this){
                this[effect]();
                this.render();
            }
        });
    });

    filterContainer.find('ul').on('mousewheel', function(e, delta) {
        this.scrollLeft -= (delta * 50);
        e.preventDefault();
    });
});