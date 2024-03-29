var domainFull = (window.location.href).split('/');
domain = domainFull[0] + "//" + domainFull[2] + "/"+ domainFull[3];


if (!isVisible(document.querySelector('#searchInput'))) {
    let searchInput = document.querySelector('#searchInput');
    document.querySelector('.searchClick').addEventListener('click', function (e) {
        if (isVisible(searchInput)) {
            searchInput.style.display = 'none';
        } else {
            searchInput.style.display = 'block';
            searchInput.focus();
        }
    });
}

document.querySelector('#searchInput').addEventListener('keyup', function (e) {
    if (e.target.value.length > 0) {
        document.querySelector('.btn-search').style.display = 'block';
    }
});

document.querySelector('#searchInput').addEventListener('focusout', function (e) {
    if (e.target.value.length === 0) {
        document.querySelector('.btn-search').style.display = 'none';
    }
});

window.addEventListener('load', function () {

    let currentUrlParam = window.location.search;

    if ((domainFull[4].split('?'))[0] !== 'detalhesLivro.html') {

        if (currentUrlParam.length > 0) {
            document.querySelector('.conteiner-row').style.display = 'none';

            let query = currentUrlParam.split('=')[1];
            let ajax = new XMLHttpRequest();

            let url = "https://www.googleapis.com/books/v1/volumes?q=";

            ajax.addEventListener('load', function(){
                let livros = JSON.parse(this.responseText);
                makeBooksRow(livros, 'Pesquisar');
                eventsMakeBooksRow();
            });
            ajax.open("GET", url+query);
            ajax.send();

            if (document.querySelectorAll('.card').length < 5) {
                setTimeout(function () {
                    document.querySelectorAll('.card-conteiner').forEach(function (e) {
                        e.style.justifyContent = 'flex-start';
                    });
                },1000);
            }

        } else {
            let ajax = new XMLHttpRequest();

            let url = "https://www.googleapis.com/books/v1/volumes?q=";

            // Cria campo de Ficção
            let query = "subject:Fiction&langRestrict=pt&maxResults=40";
            ajax.addEventListener('load', function(){
                let livrosFiccao = JSON.parse(this.responseText);
                makeBooksRow(livrosFiccao, 'Ficção');
                eventsMakeBooksRow();
            });
            ajax.open("GET", url+query);
            ajax.send();

            ajax = new XMLHttpRequest();

            url = "https://www.googleapis.com/books/v1/volumes?q=";

            // Cria campo de Familia e Relações
            query = "subject:Family+&+Relationships&langRestrict=pt";
            ajax.addEventListener('load', function(){
                let livros = JSON.parse(this.responseText);
                makeBooksRow(livros, 'Familia e Relações');
                eventsMakeBooksRow();
            });
            ajax.open("GET", url+query);
            ajax.send();
        }
    }
});

function makeBooksRow(books, title) {
    document.querySelector('.conteiner').innerHTML += '<div class="conteiner-row">';
    let row = document.querySelector('.conteiner-row:last-of-type');
    row.innerHTML += '<div class="head-data">' +
                        '<h2>'+ title +'</h2>' +
                        '<button class="btn btn-secundary btn-see-more"><i class="material-icons">add</i><span>Ver Mais</span></button>' +
                    '</div>' +
                    '<div class="card-conteiner">';
    let cardConteiner = document.querySelector('.conteiner-row:last-of-type > .card-conteiner');
    if (books.totalItems != '0') {
        books.items.forEach(function (e) {
            let book = e.volumeInfo;
                cardConteiner.innerHTML +=  '<div class="card"> ' +
                                                '<div class="card-img"> ' +
                                                    '<img src="'+ ((book.imageLinks == undefined) ? 'img/no_cover_thumb.gif' : book.imageLinks.thumbnail) +'" alt="'+ ((book.title != undefined) ? book.title : "") +'" class="capaBook" data-isbn="'+ ((book.industryIdentifiers != undefined) ? (book.industryIdentifiers[0]).identifier : "") +'"> ' +
                                                    '<span>R$ 79,90</span> ' +
                                                    '<button type="button"><i class="material-icons">add_shopping_cart</i></button> ' +
                                                '</div> ' +
                                                '<div class="card-content"> ' +
                                                    '<p class="shrinkText">'+ ((book.title != undefined) ? book.title : "") +'</p> ' +
                                                    '<p>'+ ((book.authors != undefined) ? book.authors[0] : "") +'</p> ' +
                                                '</div> ' +
                                            '</div>';
        });
    } else {
        cardConteiner.innerHTML += '<div class="card-nenhum-livro">' +
                                        '<p>Nenhum livro encontrado</p>' +
                                    '</div>' +
                                '</div>';
    }
    row.innerHTML += '</div>';
    document.querySelector('.conteiner').innerHTML += '</div>';
}

function eventsMakeBooksRow() {
    document.querySelectorAll('.capaBook').forEach(elem => elem.addEventListener('click', function (e) {
        window.location = domain + "/detalhesLivro.html?cod=" + e.target.dataset.isbn;
    }));
}