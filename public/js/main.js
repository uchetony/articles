// ajax request to delete an article
$(document).ready(() => {
    $('.delete-article').on('click', (e) => {
        $target = $(e.target)
        const id = ($target.attr('data-id'))

        if(confirm('Do you want to delete this article?')) {
            $.ajax({
                type: 'DELETE',
                url: '/articles/'+ id,
                success: (response) => {
                    window.location.href='/'
                },
                error: (err) => {
                    console.log(err)
                }
            })
        } else {
            alert('Article not deleted')
        }
    })
})