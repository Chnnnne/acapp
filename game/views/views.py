from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align:center">术士之战</h1>'
    line2 = '<img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.52miji.com%2Fimage%2F2016%2F09%2F23%2F2400879398f8cf3426ac1b307887a37f.jpg&refer=http%3A%2F%2Fimg.52miji.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641874383&t=fb3c5a6d30b9614f17c46f715df72845">'
    line3 = '<hr>'
    line4 = '<a href = "/play/">进入游戏界面 </a>'
    return HttpResponse(line1 + line4 + line3 + line2)

def play(request):
    line0 = '<h1 style = "text-align:center"> 张雨佳快去学习！</h1>'
    line1 = '<h1 style = "text-align:center"> 游戏界面 </h1>'
    line2 = '<img src = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdl.3dmgame.com%2Fuploads%2Fallimg%2F170406%2F363_170406132854_4.png&refer=http%3A%2F%2Fdl.3dmgame.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641883696&t=f6aebe164773bbfce69b851bbe322406">'
    line3 = '<a href = "/">返回主菜单 </a>'
    line4 = '<hr>'
    return HttpResponse(line0 + line1 + line3 + line4 + line2)
