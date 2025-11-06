<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, Set $set) => $set('slug', Str::slug($state))),
                
                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                
                TextInput::make('thumbnail_url')
                    ->label('Thumbnail URL')
                    ->url()
                    ->required()
                    ->placeholder('https://thumbs4.imagebam.com/...')
                    ->helperText('URL thumbnail dari imagebam'),

                TextInput::make('full_image_url')
                    ->label('Full Image URL')
                    ->url()
                    ->nullable()
                    ->placeholder('https://images4.imagebam.com/...')
                    ->helperText('URL gambar resolusi penuh (opsional)'),
                
                TextInput::make('external_view_url')
                    ->label('Viewer URL')
                    ->url()
                    ->required()
                    ->placeholder('https://www.imagebam.com/view/...')
                    ->helperText('URL viewer dari imagebam'),
                
                Repeater::make('images')
                    ->relationship()
                    ->schema([
                        TextInput::make('thumbnail_url')
                            ->label('Thumbnail URL')
                            ->url()
                            ->required()
                            ->placeholder('https://thumbs4.imagebam.com/...'),

                        TextInput::make('full_image_url')
                            ->label('Full Image URL')
                            ->url()
                            ->nullable()
                            ->placeholder('https://images4.imagebam.com/...'),
                        
                        TextInput::make('external_view_url')
                            ->label('Viewer URL')
                            ->url()
                            ->required()
                            ->placeholder('https://www.imagebam.com/view/...'),
                        
                        TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ])
                    ->defaultItems(0)
                    ->maxItems(3)
                    ->collapsible()
                    ->itemLabel(fn (array $state): ?string => $state['thumbnail_url'] ?? null),
                
                TextInput::make('size_info')
                    ->label('Size Information')
                    ->maxLength(255)
                    ->placeholder('1.2 GB'),
                
                TextInput::make('external_link')
                    ->label('Download Link')
                    ->url()
                    ->maxLength(255)
                    ->placeholder('https://...'),
                
                Select::make('categories')
                    ->relationship('categories', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
                
                Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                    ])
                    ->default('draft')
                    ->required(),
                
                DateTimePicker::make('published_at')
                    ->label('Published At')
                    ->nullable(),
                
                Toggle::make('is_featured')
                    ->label('Featured'),
                
                Toggle::make('is_popular')
                    ->label('Popular'),
            ]);
    }
}