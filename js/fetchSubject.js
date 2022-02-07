$(".subject-header").hide();
$('tfoot').hide();

var url = 'http://www.fulek.com/VUA/SUPIT/GetNastavniPlan';
var xmlhttpGetAllSubjects = new XMLHttpRequest();
xmlhttpGetAllSubjects.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var allSubjects = JSON.parse(this.responseText);
    console.log(allSubjects);

    //autocomplete naziva kolegija
    $('.input_lecture').autocomplete({
      source:allSubjects,
      minLength: 1,
      select: function(event, ui){
        event.preventDefault();
        $(".input_lecture").val(ui.item.label);
      }
    })

    //prikaz detalja pojedinog kolegija
    $(document).ready(function () {
      $('.input_lecture').on('autocompleteselect', function (e, ui) {
        var id =  ui.item.value;

        var url2 = `http://www.fulek.com/VUA/supit/GetKolegij/${id}`;
        var xmlhttpGetSubject = new XMLHttpRequest();
        xmlhttpGetSubject.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var mySubject = JSON.parse(this.responseText);
            //template za pojedini kolegij
            var html;
            html = '<tr class="subject-info">';
            html += '<td>'+mySubject.kolegij+'</td>';
            html += '<td class="ects">'+mySubject.ects+'</td>';
            html += '<td class="sati">'+mySubject.sati+'</td>';
            html += '<td>'+mySubject.predavanja+'</td>';
            html += '<td>'+mySubject.vjezbe+'</td>';
            html += '<td>'+mySubject.tip+'</td>';
            html += '<td><button class="subject-button" type="button">Obriši</button></td>';
            html += '</tr>';

              
            $(".plan").append(html);
            
            if ($('.subject-info').length > 0) {
                $(".subject-header").show();
                $('tfoot').show();
              }

            //sum ects i sati
            var sum = 0;
            var sati = 0;

            $('table tr.subject-info').each(function() {
              var sum_ects = +$(this).find("td.ects").text();
              sum += sum_ects;
              var sum_sati = +$(this).find("td.sati").text();
              sati += sum_sati;
            })
            //console.log("test sum nakon dodavanja:" + sum);
            $('.ects_result').text(sum);
            $('.sati_result').text(sati);
          }

          // brisanje tr - (pojedinog kolegija)
          $('.subject-info').on('click', 'button', function(){

            $(this).parent().parent().remove();

            if ($('.subject-info').length == 0) {
                $(".subject-header").hide();
                $(".subject-total").hide();
                $('tfoot').hide();
            }

            var new_total_ects = 0;
            var new_total_hours = 0;

            $('table tr.subject-info').each(function() {
              var sum_ects = parseInt($(this).find("td.ects").text(), 10);
              new_total_ects += sum_ects;
              var sum_sati = parseInt($(this).find("td.sati").text(), 10);
              new_total_hours += sum_sati;
              console.log('kliknuti', sum_ects)
            })
            //console.log("test sum nakon dodavanja:" + sum);
            $('.ects_result').text(new_total_ects);
            $('.sati_result').text(new_total_hours);
          });

        };
        xmlhttpGetSubject.open("GET", url2, true);
        xmlhttpGetSubject.send();

      });
    });
  }
};
xmlhttpGetAllSubjects.open("GET", url, true);
xmlhttpGetAllSubjects.send();
