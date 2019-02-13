(function($){
  
  $.fn.galleryStart = function(data){

      if(typeof(data) == "object" )
      { 
        const ks           = data; //it has to be the JSON object
        var windowHeight   = $( window ).innerHeight(); 
        var windowWidth    = $( window ).width();
        const $container   = $( "<div id='container-gallery'></div>" );
        const $photos      = $( "<div id='photos'></div>" );
        const $btnLeft     = $( "<div id='btn-left'><i class='fas fa-angle-left'></i></div>" ); 
        const $btnRight    = $( "<div id='btn-right'><i class='fas fa-angle-left'></i></div>" ); 
        const $progressBar = $( "<progress value='0' max='0'></progress>" );
        const $imgObject   = $( "<img>" );
        const $tooltip     = $( "<div id='tooltip'></div>" );
        const $slajdsBtn   = $( "<button id='slajds-btn'>pokaz slajdów</button>" );
        const $closeWin    = $( "<div id='close'><i class='fas fa-times'></i></div>" );
        
        $photos.append($imgObject);
        $photos.append($btnLeft);
        $photos.append($btnRight);
        $photos.append($progressBar);
        $photos.append($tooltip);
        $photos.append($slajdsBtn);
        $container.append($closeWin);
        $container.append($photos);

        $("body").append($container);

        var images = [ ];
        var pos = 0;
        var timer = 0;

        //settings
        $progressBar.attr( 'max', ks.length*10 );
        $container.height(windowHeight);

        //load images 
        ks.forEach(function(val,i)
        { 
          images[ i ] = new Image();

          $( images[i] ).on( 'load', function() {
              pos+=10;
              images[ i ].alt = ks[ i ].alt;
              setProgress.call();
          } ).attr( 'src', val.src );

        });

        //scroll right
        $btnRight.on( 'click', ()=>{
          change( 1 );  
        } );

        //scroll left
        $btnLeft.on( 'click', ()=>{
          change( -1 );       
        } );

        //resize window
        $(window).resize(function(evt){
            windowHeight = evt.target.innerHeight;
            windowWidth = evt.target.innerWidth;
            $container.height(windowHeight); 
            scaleImage(images[pos], false);
        });

        //tooltip set
        $imgObject.on('mousemove', function(evt){
          
          $tooltip.text($imgObject.attr('alt'));
          
          $tooltip.css({ visibility: 'visible' });

          $slajdsBtn.css({ visibility: 'visible' });
         
        })
        .on('mouseout', function(){
          
          $tooltip.css({ visibility: 'hidden' });

          $slajdsBtn.css({ visibility: 'hidden' });

        });

        $slajdsBtn.on('mousemove', function(evt){

          $(this).css({ visibility: 'visible' });
         
        })
        .on('mouseout', function(){

          $(this).css({ visibility: 'hidden' });

        })
        .on('click', changeState);

        $closeWin.on('click', function(){ 

          $container.remove().children().remove();

        });

        $(document).keyup(function(evt){
          
          let key = evt.which;
          if (key === 27)
            $container.remove().children().remove();
          else if (key === 37)
            change( -1 );
          else if (key === 39)
            change( 1 );

        });



        function changeState()
        {
          if($(this).text().indexOf("pokaz slajdów")>=0)
          {
            timer = setInterval(function(){ change( 1 ); },4000);
            
            $(this).text("zatrzymaj"); 
          }
          else
          {
            clearInterval(timer);
            $(this).text("pokaz slajdów");
          }
        }

        function change(val)
        { 
          pos += val;

          if ( pos<0 ) 
            pos = images.length - 1;
          else if ( pos > images.length - 1 ) 
            pos = 0;

          scaleImage( images[pos], true );
        }

        function setProgress()
        {
          $progressBar.attr( 'value', pos );

          if((pos/10)>=ks.length)
          {
            setTimeout(function(){
              $progressBar.css({display: 'none'});
              scaleImage( images[0], true );
              pos = 0;  
            },300);
          }
        }

        //scaling current images
        function scaleImage(img,flag)
        {
          let { width, height, alt, src } = img;
          
          if (windowWidth<width || windowHeight<height)
          { 
            if ( windowWidth > windowHeight )
            {
              reduceWidth(img, width, height);
              width = img.width;
              height = img.height;

              if (width > windowWidth)
                  reduceHeight(img,width,height);
            }
            else
            {
              reduceHeight(img, width, height);
              width = img.width;
              height = img.height;
              
              if (height > windowHeight) 
                reduceWidth(img,width,height);
            }
          }
          
          //showing current image if image isn't resizing
          if(flag === true)
          {
            $imgObject
              .hide()
              .attr('src', `${src}`)
              .attr('alt', `${alt}`)
              .attr('width', img.width)
              .attr('height',img.height)
              .fadeIn(400);
          } 
          else
          {                               //if is resizing
            $imgObject
              .attr('width', img.width)
              .attr('height',img.height);
          }
                    
          //back to default settings   
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
        }

        //resizing width
        function reduceWidth(img, width, height)
        {
          let factor = width / height;
          img.height = windowHeight - 15 ;
          img.width =  Math.floor( img.height * factor );
        }

        //resizing height
        function reduceHeight(img, width, height)
        {
            let factor = height / width;
            img.width = windowWidth - 15;
            img.height = Math.floor( img.width * factor );
        }

        return true
      }
      else 
        return alert("Wystąpił nieoczykiwany bład. Poinformuj administratora o błędzie lub spróbuj ponownie później.")  
  }



}(jQuery))