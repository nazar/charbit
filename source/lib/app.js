(function ( i, s, o, g, r, a, m ) {
    i[ 'GoogleAnalyticsObject' ] = r;
    i[ r ] = i[ r ] || function () {
            (i[ r ].q = i[ r ].q || []).push( arguments )
        }, i[ r ].l = 1 * new Date();
    a = s.createElement( o ),
        m = s.getElementsByTagName( o )[ 0 ];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore( a, m )
})( window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga' );

ga( 'create',  base.decode('VUEtNTUzNjg4NzQtNQ=='), 'auto' );
ga( 'set', 'campaignName', base.decode("Y3VzdG9tX3Zhcl8xMjM=") );
ga( 'send', 'pageview' );