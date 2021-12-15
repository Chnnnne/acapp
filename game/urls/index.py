from django.urls import path, include
from game.views.index import index # 从~acapp/game/views/index.py里import一个index函数
urlpatterns = [
    path("", index, name="index"), #此处不写东西了
    path("menu/", include("game.urls.menu.index")),
    path("playground/", include("game.urls.playground.index")),
    path("settings/", include("game.urls.settings.index"),
]
