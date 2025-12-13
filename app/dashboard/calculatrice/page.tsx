'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Tabs, TabsContent, TabsTrigger} from "@/app/components/ui/tabs";
import {TabsList} from "@radix-ui/react-tabs";
import {CalculatorIcon} from "lucide-react";

export default function CalculatricePage() {

    return (
        <>
            <div className={"space-y-6"}>
                <div>
                    <h1 className={"text-3xl mb-2"}>Calculatrice Financière</h1>
                    <p className={"text-muted-foreground"}>Outils de calcul pour planifier vos investissements et budget</p>
                </div>

                <Tabs defaultValue="compound">
                    <TabsList className={"grid w-full max-w-md grid-cols-3"}>
                        <TabsTrigger value={"compound"}>Intérêts composés</TabsTrigger>
                        <TabsTrigger value="return">Rendement</TabsTrigger>
                        <TabsTrigger value="expenses">Dépenses</TabsTrigger>
                    </TabsList>
                    <TabsContent value={"compound"}>
                        <div className="grid lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalculatorIcon className="w-5 h-5 text-[#38BDF8]" />
                                        Calculatrice
                                    </CardTitle>
                                </CardHeader>
                                <div className={'space-y-6'}>
                                    <label>Capital initial</label>
                                    <Input
                                    value={capitalInitial}
                                    className={'mt-3.5'}

                                    />
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
