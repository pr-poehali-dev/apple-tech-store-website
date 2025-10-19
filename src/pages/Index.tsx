import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'iPhone',
    price: '999',
    image: 'https://cdn.poehali.dev/projects/f467f675-d567-42fd-8c0c-1be8819acdc5/files/db6bd838-9121-4e05-aeb6-4a92633829ed.jpg',
    description: 'Титановый корпус. Чип A17 Pro. Кнопка действия.'
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    category: 'Mac',
    price: '1999',
    image: 'https://cdn.poehali.dev/projects/f467f675-d567-42fd-8c0c-1be8819acdc5/files/f6276020-c350-4a3a-80b6-9d7cab0bfa1c.jpg',
    description: 'Невероятная производительность. Дисплей Liquid Retina XDR.'
  },
  {
    id: 3,
    name: 'iPad Pro',
    category: 'iPad',
    price: '799',
    image: 'https://cdn.poehali.dev/projects/f467f675-d567-42fd-8c0c-1be8819acdc5/files/855407fa-ff2b-43a6-a2bd-883aeebc7830.jpg',
    description: 'Чип M2. Дисплей ProMotion. Поддержка Apple Pencil.'
  }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + parseInt(item.price) * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Icon name="Apple" size={24} className="text-apple-gray" />
              <span className="text-xl font-semibold text-apple-gray">iSTORE66</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-sm hover:text-apple-blue transition-colors"
              >
                Главная
              </button>
              <button 
                onClick={() => scrollToSection('catalog')}
                className="text-sm hover:text-apple-blue transition-colors"
              >
                Каталог
              </button>
              <button 
                onClick={() => scrollToSection('applecare')}
                className="text-sm hover:text-apple-blue transition-colors"
              >
                AppleCare
              </button>
              <button 
                onClick={() => scrollToSection('contacts')}
                className="text-sm hover:text-apple-blue transition-colors"
              >
                Контакты
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={24} />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-apple-blue text-white text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-semibold">Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col h-full">
                    {cart.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <Icon name="ShoppingCart" size={64} className="text-gray-300 mb-4" />
                        <p className="text-lg text-gray-600">Корзина пуста</p>
                        <p className="text-sm text-gray-400 mt-2">Добавьте товары из каталога</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                          {cart.map(item => (
                            <Card key={item.id} className="border shadow-sm rounded-2xl overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <div className="w-20 h-20 bg-apple-light rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base truncate">{item.name}</h4>
                                    <p className="text-sm text-gray-600 mt-1">${item.price}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                      <div className="flex items-center gap-2 bg-apple-light rounded-full px-3 py-1">
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          className="text-gray-600 hover:text-apple-blue transition-colors"
                                        >
                                          <Icon name="Minus" size={16} />
                                        </button>
                                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="text-gray-600 hover:text-apple-blue transition-colors"
                                        >
                                          <Icon name="Plus" size={16} />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
                                      >
                                        <Icon name="Trash2" size={18} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="border-t pt-6 pb-6 space-y-4">
                          <div className="flex justify-between items-center text-lg">
                            <span className="font-medium">Товаров:</span>
                            <span className="text-gray-600">{getTotalItems()} шт.</span>
                          </div>
                          <div className="flex justify-between items-center text-2xl font-semibold">
                            <span>Итого:</span>
                            <span className="text-apple-blue">${getTotalPrice()}</span>
                          </div>
                          <Button className="w-full bg-apple-blue hover:bg-apple-blue/90 text-white py-6 text-lg rounded-xl">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-apple-light px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-apple-gray mb-6">
              Техника Apple.
              <br />
              <span className="text-apple-blue">Здесь и сейчас.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Официальные продукты Apple с полной гарантией AppleCare. Консультация специалистов и быстрая доставка.
            </p>
            <Button 
              size="lg" 
              onClick={() => scrollToSection('catalog')}
              className="bg-apple-blue hover:bg-apple-blue/90 text-white px-8 py-6 text-lg rounded-xl"
            >
              Перейти в каталог
            </Button>
          </div>
        </section>

        <section id="catalog" className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-apple-gray mb-4">Каталог</h2>
              <p className="text-xl text-gray-600">Выберите устройство своей мечты</p>
            </div>

            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="rounded-full"
              >
                Все
              </Button>
              <Button
                variant={selectedCategory === 'iphone' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('iphone')}
                className="rounded-full"
              >
                <Icon name="Smartphone" size={18} className="mr-2" />
                iPhone
              </Button>
              <Button
                variant={selectedCategory === 'mac' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('mac')}
                className="rounded-full"
              >
                <Icon name="Laptop" size={18} className="mr-2" />
                Mac
              </Button>
              <Button
                variant={selectedCategory === 'ipad' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('ipad')}
                className="rounded-full"
              >
                <Icon name="Tablet" size={18} className="mr-2" />
                iPad
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="aspect-square bg-apple-light rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                    <CardDescription className="text-base mt-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex justify-between items-center">
                      <p className="text-3xl font-semibold text-apple-gray">от ${product.price}</p>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="bg-apple-blue hover:bg-apple-blue/90 rounded-full px-6"
                      >
                        Купить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="applecare" className="py-24 px-4 bg-apple-light">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Icon name="Shield" size={64} className="text-apple-blue mx-auto mb-6" />
              <h2 className="text-5xl font-bold text-apple-gray mb-4">AppleCare+</h2>
              <p className="text-xl text-gray-600">Защита, которая всегда с вами</p>
            </div>

            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mb-8">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-apple-blue/10 p-3 rounded-full">
                      <Icon name="CheckCircle2" size={24} className="text-apple-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Расширенная гарантия</h3>
                      <p className="text-gray-600">До 3 лет технической поддержки и обслуживания</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-apple-blue/10 p-3 rounded-full">
                      <Icon name="Wrench" size={24} className="text-apple-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ремонт при повреждениях</h3>
                      <p className="text-gray-600">Покрытие случайных повреждений с минимальной франшизой</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-apple-blue/10 p-3 rounded-full">
                      <Icon name="Headphones" size={24} className="text-apple-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Приоритетная поддержка</h3>
                      <p className="text-gray-600">Прямой доступ к специалистам Apple в любое время</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-2xl px-6 border-0 shadow-md">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Что покрывает AppleCare+?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  AppleCare+ покрывает техническую поддержку, гарантийное обслуживание и до двух случаев случайного повреждения в течение 12 месяцев. Каждый случай подлежит франшизе.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white rounded-2xl px-6 border-0 shadow-md">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Когда нужно приобрести AppleCare+?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  AppleCare+ можно приобрести вместе с устройством или в течение 60 дней после покупки. Для добавления плана после покупки может потребоваться диагностика устройства.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white rounded-2xl px-6 border-0 shadow-md">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Можно ли продлить AppleCare+?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Да, по истечении срока действия AppleCare+ вы можете продлить покрытие на ежегодной или ежемесячной основе, пока ваше устройство находится под защитой плана.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section id="contacts" className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-apple-gray mb-8">Контакты</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-lg rounded-3xl p-8">
                <Icon name="Phone" size={32} className="text-apple-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Телефон</h3>
                <p className="text-gray-600">+7 (800) 555-35-35</p>
                <p className="text-sm text-gray-500 mt-2">Ежедневно, 9:00 - 21:00</p>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl p-8">
                <Icon name="Mail" size={32} className="text-apple-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600">support@applestore.ru</p>
                <p className="text-sm text-gray-500 mt-2">Ответим в течение 24 часов</p>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl p-8">
                <Icon name="MapPin" size={32} className="text-apple-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Адрес</h3>
                <p className="text-gray-600">Москва, Тверская 1</p>
                <p className="text-sm text-gray-500 mt-2">Пн-Вс: 10:00 - 22:00</p>
              </Card>
            </div>

            <div className="bg-apple-light rounded-3xl p-12">
              <h3 className="text-3xl font-semibold mb-4">Остались вопросы?</h3>
              <p className="text-gray-600 mb-6">Свяжитесь с нами любым удобным способом</p>
              <Button size="lg" className="bg-apple-blue hover:bg-apple-blue/90 rounded-full px-8">
                Написать нам
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-apple-gray text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Магазин</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">iPhone</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mac</a></li>
                <li><a href="#" className="hover:text-white transition-colors">iPad</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AppleCare+</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Трейд-ин</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Гарантия</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Возврат</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Соцсети</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Icon name="Instagram" size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Icon name="Twitter" size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Icon name="Youtube" size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Apple Store. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}