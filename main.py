# configutações iniciais
import pygame
import random
import os

pygame.init()
pygame.mixer.init()

# sons
bite = pygame.mixer.Sound('files/bite.mp3')
musica_menu = 'files/menusong.mp3'
musica_game = 'files/game.mp3'

# criando tela
pygame.display.set_caption('Snake, the GAME')
largura, altura = 800, 600
largura_interna, altura_interna, margem_x, margem_y = largura/5*4, altura/5*4, largura/10, altura/10
tela = pygame.display.set_mode((largura, altura))
relogio = pygame.time.Clock()

# cores
preto = (0, 0, 0)
cinza = (25, 25, 25)
branco = (255, 255, 255)
vermelho = (255, 0, 0)
verde = (0, 255, 0)
azul = (0, 0, 255)

# parametros da cobra
tamanho_quadrado = 20
velocidade_jogo = 12

score = 0


class Botao:
    def __init__(self, posicao_x, posicao_y, largura, altura, cor, cor_hover, texto, fonte, cor_texto):
        self.retangulo = pygame.Rect(posicao_x, posicao_y, largura, altura)
        self.cor = cor
        self.cor_hover = cor_hover
        self.texto = texto
        self.fonte = fonte
        self.cor_texto = cor_texto
        self.clicado = False

    def desenhar(self, tela):
        pygame.draw.rect(tela, self.cor_hover if self.retangulo.collidepoint(pygame.mouse.get_pos()) else self.cor, self.retangulo)
        texto_renderizado = self.fonte.render(self.texto, True, self.cor_texto)
        retangulo_texto = texto_renderizado.get_rect(center=self.retangulo.center)
        tela.blit(texto_renderizado, retangulo_texto)

    def clicar(self):
        if self.retangulo.collidepoint(pygame.mouse.get_pos()):
            self.clicado = True
            return True
        return False


def menu():
    comecar = False
    fonte = pygame.font.Font(os.path.join('files/glorial.ttf'), 50)
    fonte2 = pygame.font.SysFont('arialblack', 24)
    fonte3 = pygame.font.SysFont('arial', 16)
    botao_inicio = Botao(340, 310, 100, 30, cinza, vermelho, "Iniciar", fonte2, verde)
    pontuacao = fonte3.render(f'Last Score: {score}', True, vermelho)

    pygame.mixer_music.load(musica_menu)
    pygame.mixer_music.play(-1)
    while not comecar:
        tela.fill(preto)

        texto = fonte.render("Snake", True, verde)
        tela.blit(texto, [largura/5*2, altura/3])
        tela.blit(pontuacao, [345, 350])
        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                comecar = True
            if evento.type == pygame.MOUSEBUTTONDOWN:
                if botao_inicio.clicar():
                    comecar = True
                    rodar_jogo()
        botao_inicio.desenhar(tela)
        if comecar:
            tela.fill(preto)
        pygame.display.update()
        relogio.tick(velocidade_jogo)

def gerar_comida():
    x = round(random.randrange(int(margem_x), int(margem_x) + int(largura_interna) - tamanho_quadrado) / 20.0) * 20.0
    y = round(random.randrange(int(margem_y), int(margem_y) + int(altura_interna) - tamanho_quadrado) / 20.0) * 20.0
    return x, y


def desenhar_comida(tamanho, comida_x, comida_y):
    pygame.draw.rect(tela, vermelho, [comida_x, comida_y, tamanho,
                                   tamanho])  # tamanho duas vezes, pq é um quadrado, altura e a largura iguais


def desenhar_cobra(tamanho, pixels):
    for pixel in pixels:
        pygame.draw.rect(tela, verde, [pixel[0], pixel[1], tamanho, tamanho])


def desenhar_pontuacao(pontos):
    fonts = pygame.font.SysFont('Helvetica', 35)
    texto = fonts.render(f"Pontos: {pontos}", True, vermelho)
    tela.blit(texto, [325, 10])
    global score
    score = pontos


def selecionar_velocidade(tecla, x, y, direct):
    velocidade_x = x
    velocidade_y = y
    if tecla == pygame.K_DOWN and direct != 'up':
        velocidade_x = 0
        velocidade_y = tamanho_quadrado
        direct = "down"
    elif tecla == pygame.K_UP and direct != 'down':
        velocidade_x = 0
        velocidade_y = -tamanho_quadrado
        direct = "up"
    elif tecla == pygame.K_RIGHT and direct != 'left':
        velocidade_x = tamanho_quadrado
        velocidade_y = 0
        direct = "right"
    elif tecla == pygame.K_LEFT and direct != 'right':
        velocidade_x = -tamanho_quadrado
        velocidade_y = 0
        direct = "left"
    else:
        pass
    return velocidade_x, velocidade_y, direct


def rodar_jogo():
    fim_jogo = False

    global velocidade_jogo

    pygame.mixer_music.load(musica_game)
    pygame.mixer_music.play(-1)

    dificultade = 0

    x = largura / 2
    y = altura / 2

    velocidade_x = 0
    velocidade_y = 0

    tamanho_cobra = 1
    pixels = []
    comida_x, comida_y = gerar_comida()
    direct = ""
    limitedecontrole = 0

    while not fim_jogo:
        tela.fill(preto)
        pygame.draw.rect(tela, cinza, [margem_x, margem_y, largura_interna, altura_interna])

        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                fim_jogo = True
            elif evento.type == pygame.KEYDOWN and limitedecontrole == 0:
                limitedecontrole = 1
                velocidade_x, velocidade_y, direct = selecionar_velocidade(evento.key, velocidade_x, velocidade_y, direct)
        # atualizando posição
        x += velocidade_x
        y += velocidade_y
        pixels.append([x, y])  # criando movimentação visual
        if len(pixels) > tamanho_cobra:
            del pixels[0]
        desenhar_cobra(tamanho_quadrado, pixels)
        limitedecontrole = 0

        if x < margem_x or x >= margem_x + largura_interna or y < margem_y or y >= margem_y + altura_interna:
            menu()
            fim_jogo = True

        desenhar_pontuacao(tamanho_cobra - 1)
        for pixel in pixels[:-1]:  # caso bate em si mesmo
            if pixel == ([x, y]):
                menu()
                fim_jogo = True

        # comida
        desenhar_comida(tamanho_quadrado, comida_x, comida_y)
        if x == comida_x and y == comida_y:
            tamanho_cobra += 1
            dificultade += 1
            bite.play()
            if dificultade == 3:
                velocidade_jogo += 1
                dificultade = 0
            comida_x, comida_y = gerar_comida()
            while [comida_x, comida_y] in pixels: # evitando que comida apareça dentro da cobra
                comida_x, comida_y = gerar_comida()
        if fim_jogo:
            tela.fill(preto)
        pygame.display.update()
        relogio.tick(velocidade_jogo)


menu()